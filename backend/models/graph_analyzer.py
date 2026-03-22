"""
Layer 3 — Graph-Based Fraud Ring Detection
NetworkX + PageRank + Louvain community detection.
"""
import numpy as np
import pandas as pd
import networkx as nx

try:
    import community as community_louvain
except ImportError:
    community_louvain = None


class GraphAnalyzer:
    def __init__(self):
        self.graph = None
        self.communities = {}
        self.suspicious_clusters = []
        self.node_data = {}

    def build_graph(self, df: pd.DataFrame):
        """Build transaction graph from dataset."""
        self.graph = nx.DiGraph()

        # Aggregate edges: sender -> receiver with total amount and count
        edge_data = df.groupby(["sender_id", "receiver_id"]).agg(
            total_amount=("amount", "sum"),
            txn_count=("amount", "count"),
            fraud_count=("is_fraud", "sum"),
        ).reset_index()

        for _, row in edge_data.iterrows():
            self.graph.add_edge(
                row["sender_id"],
                row["receiver_id"],
                weight=row["txn_count"],
                amount=row["total_amount"],
                fraud_count=row["fraud_count"],
            )

        # Node attributes
        user_stats = df.groupby("sender_id").agg(
            total_sent=("amount", "sum"),
            txn_count=("amount", "count"),
            fraud_count=("is_fraud", "sum"),
            avg_amount=("amount", "mean"),
        ).to_dict("index")

        for node in self.graph.nodes():
            stats = user_stats.get(node, {})
            self.graph.nodes[node]["total_sent"] = stats.get("total_sent", 0)
            self.graph.nodes[node]["txn_count"] = stats.get("txn_count", 0)
            self.graph.nodes[node]["fraud_count"] = stats.get("fraud_count", 0)
            self.graph.nodes[node]["avg_amount"] = stats.get("avg_amount", 0)

        self._detect_fraud_patterns(df)
        print(f"Graph built: {self.graph.number_of_nodes()} nodes, {self.graph.number_of_edges()} edges")

    def _detect_fraud_patterns(self, df: pd.DataFrame):
        """Run all graph-based fraud detection algorithms."""
        G_undirected = self.graph.to_undirected()

        # 1. PageRank
        pagerank = nx.pagerank(self.graph, alpha=0.85)

        # 2. Degree centrality
        in_degree = dict(self.graph.in_degree(weight="weight"))
        out_degree = dict(self.graph.out_degree(weight="weight"))

        # 3. Louvain community detection
        if community_louvain:
            self.communities = community_louvain.best_partition(G_undirected)
        else:
            # Fallback: connected components
            self.communities = {}
            for i, comp in enumerate(nx.connected_components(G_undirected)):
                for node in comp:
                    self.communities[node] = i

        # 4. Detect circular flows via reciprocal edges (A→B and B→A)
        # This is O(E) instead of exponential simple_cycles
        cycle_nodes = set()
        for u, v in self.graph.edges():
            if self.graph.has_edge(v, u):
                cycle_nodes.add(u)
                cycle_nodes.add(v)

        # Build node data
        pr_values = list(pagerank.values())
        pr_mean = np.mean(pr_values) if pr_values else 0
        pr_std = np.std(pr_values) if pr_values else 1

        for node in self.graph.nodes():
            pr = pagerank.get(node, 0)
            pr_z = (pr - pr_mean) / max(pr_std, 1e-10)
            in_d = in_degree.get(node, 0)
            out_d = out_degree.get(node, 0)

            # Risk scoring for mule detection
            mule_score = 0
            if in_d > 0 and out_d > 0:
                flow_ratio = min(in_d, out_d) / max(in_d, out_d)
                if flow_ratio > 0.8:  # similar in/out = pass-through
                    mule_score += 0.3
            if pr_z > 2:
                mule_score += 0.3
            if self.graph.nodes[node].get("fraud_count", 0) > 0:
                mule_score += 0.3

            # Check if node is in a cycle (reciprocal edges)
            in_cycle = node in cycle_nodes
            if in_cycle:
                mule_score += 0.2

            mule_score = min(mule_score, 1.0)

            self.node_data[node] = {
                "pagerank": round(pr, 6),
                "pagerank_zscore": round(pr_z, 2),
                "in_degree": in_d,
                "out_degree": out_d,
                "community": self.communities.get(node, 0),
                "mule_score": round(mule_score, 2),
                "is_mule": mule_score > 0.5,
                "is_fraud_node": self.graph.nodes[node].get("fraud_count", 0) > 0,
                "in_cycle": in_cycle,
            }

        # Identify suspicious clusters
        cluster_fraud = {}
        for node, data in self.node_data.items():
            cid = data["community"]
            if cid not in cluster_fraud:
                cluster_fraud[cid] = {"members": [], "fraud_nodes": 0, "mule_nodes": 0, "total_amount": 0}
            cluster_fraud[cid]["members"].append(node)
            if data["is_fraud_node"]:
                cluster_fraud[cid]["fraud_nodes"] += 1
            if data["is_mule"]:
                cluster_fraud[cid]["mule_nodes"] += 1
            cluster_fraud[cid]["total_amount"] += self.graph.nodes[node].get("total_sent", 0)

        self.suspicious_clusters = []
        for cid, info in cluster_fraud.items():
            if len(info["members"]) < 3:
                continue
            fraud_ratio = info["fraud_nodes"] / len(info["members"])
            if fraud_ratio > 0.1 or info["mule_nodes"] > 0:
                risk = "CRITICAL" if fraud_ratio > 0.3 else "HIGH" if fraud_ratio > 0.15 else "MEDIUM"
                self.suspicious_clusters.append({
                    "cluster_id": f"C{cid:03d}",
                    "members": len(info["members"]),
                    "member_ids": info["members"][:10],  # limit for API
                    "fraud_nodes": info["fraud_nodes"],
                    "mule_nodes": info["mule_nodes"],
                    "total_amount": round(info["total_amount"], 2),
                    "risk": risk,
                    "fraud_ratio": round(fraud_ratio, 3),
                })

        self.suspicious_clusters.sort(key=lambda x: x["fraud_ratio"], reverse=True)

    def get_graph_data(self) -> dict:
        """Return graph data for frontend visualization."""
        if self.graph is None:
            return {"nodes": [], "edges": [], "clusters": []}

        # Select nodes for visualization (top by various metrics)
        top_nodes = set()

        # Add all fraud/mule nodes
        for node, data in self.node_data.items():
            if data["is_fraud_node"] or data["is_mule"]:
                top_nodes.add(node)

        # Add connected neighbors
        neighbors = set()
        for node in list(top_nodes):
            for neighbor in list(self.graph.predecessors(node))[:3]:
                neighbors.add(neighbor)
            for neighbor in list(self.graph.successors(node))[:3]:
                neighbors.add(neighbor)
        top_nodes.update(neighbors)

        # Add some normal nodes for contrast
        normal_nodes = [n for n in self.graph.nodes() if n not in top_nodes]
        if normal_nodes:
            top_nodes.update(np.random.choice(normal_nodes, size=min(20, len(normal_nodes)), replace=False))

        # Limit to max 60 nodes for visualization
        top_nodes = list(top_nodes)[:60]

        # Position via spring layout
        subgraph = self.graph.subgraph(top_nodes)
        pos = nx.spring_layout(subgraph, seed=42, k=2)

        nodes_out = []
        for node in top_nodes:
            x, y = pos.get(node, (0, 0))
            data = self.node_data.get(node, {})
            nodes_out.append({
                "id": node,
                "x": round(float(x) * 40 + 50, 2),
                "y": round(float(y) * 40 + 50, 2),
                "fraud": data.get("is_fraud_node", False),
                "mule": data.get("is_mule", False),
                "mule_score": data.get("mule_score", 0),
                "community": data.get("community", 0),
            })

        edges_out = []
        node_set = set(top_nodes)
        for u, v, d in subgraph.edges(data=True):
            if u in node_set and v in node_set:
                edges_out.append({
                    "from": u,
                    "to": v,
                    "fraud": d.get("fraud_count", 0) > 0,
                    "weight": d.get("weight", 1),
                })

        return {
            "nodes": nodes_out,
            "edges": edges_out,
            "clusters": self.suspicious_clusters[:5],
            "stats": {
                "total_nodes": self.graph.number_of_nodes(),
                "total_edges": self.graph.number_of_edges(),
                "fraud_nodes": sum(1 for d in self.node_data.values() if d["is_fraud_node"]),
                "mule_accounts": sum(1 for d in self.node_data.values() if d["is_mule"]),
                "suspicious_clusters": len(self.suspicious_clusters),
            },
        }
