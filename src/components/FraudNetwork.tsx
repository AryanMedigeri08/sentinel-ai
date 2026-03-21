import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface Node { id: string; x: number; y: number; fraud: boolean; mule: boolean; }
interface Edge { from: string; to: string; fraud: boolean; }

const generateGraph = () => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const count = 24;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const ring = i < 8 ? 0.3 : i < 16 ? 0.6 : 0.85;
    nodes.push({
      id: `U${String(i + 1).padStart(3, "0")}`,
      x: 50 + Math.cos(angle) * ring * 40 + (Math.random() - 0.5) * 8,
      y: 50 + Math.sin(angle) * ring * 40 + (Math.random() - 0.5) * 8,
      fraud: [2, 3, 5, 14, 15].includes(i),
      mule: [7, 11, 19].includes(i),
    });
  }

  const pairs = [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,8],[1,9],[9,10],[10,11],[11,12],[3,5],[5,14],[14,15],[15,3],[13,14],[16,17],[17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,16],[7,19],[11,7]];
  pairs.forEach(([f, t]) => {
    const fraudEdge = nodes[f].fraud && nodes[t].fraud;
    edges.push({ from: nodes[f].id, to: nodes[t].id, fraud: fraudEdge });
  });

  return { nodes, edges };
};

const FraudNetwork = () => {
  const { nodes, edges } = useMemo(generateGraph, []);
  const [detected, setDetected] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleDetect = useCallback(() => {
    setDetected(false);
    setTimeout(() => setDetected(true), 1200);
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fraud Ring <span className="gradient-text">Network</span> Detection
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Graph Neural Networks identify coordinated fraud rings and mule accounts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Normal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(0,72%,55%)]" /> Fraud
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(38,92%,55%)]" /> Mule
              </span>
            </div>
            <button onClick={handleDetect} className="btn-primary text-xs px-4 py-2">
              <Search className="w-3.5 h-3.5" /> Detect Mule Accounts
            </button>
          </div>

          <svg viewBox="0 0 100 100" className="w-full max-w-2xl mx-auto aspect-square">
            {edges.map((e, i) => {
              const from = nodes.find((n) => n.id === e.from)!;
              const to = nodes.find((n) => n.id === e.to)!;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={detected && e.fraud ? "hsl(0,72%,55%)" : "hsl(222,30%,20%)"}
                  strokeWidth={detected && e.fraud ? 0.4 : 0.15}
                  opacity={detected && e.fraud ? 0.8 : 0.5}
                  className="transition-all duration-700"
                />
              );
            })}
            {nodes.map((n) => {
              const isFraud = detected && n.fraud;
              const isMule = detected && n.mule;
              const fill = isFraud ? "hsl(0,72%,55%)" : isMule ? "hsl(38,92%,55%)" : "hsl(190,95%,55%)";
              const r = hoveredNode === n.id ? 2.2 : isFraud || isMule ? 1.8 : 1.2;
              return (
                <g key={n.id}>
                  {(isFraud || isMule) && (
                    <circle cx={n.x} cy={n.y} r={3} fill={fill} opacity={0.15} className="animate-pulse" />
                  )}
                  <circle
                    cx={n.x} cy={n.y} r={r}
                    fill={fill}
                    className="transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ filter: isFraud || isMule ? `drop-shadow(0 0 3px ${fill})` : undefined }}
                  />
                  {hoveredNode === n.id && (
                    <text x={n.x} y={n.y - 3} textAnchor="middle" fill="hsl(210,40%,96%)" fontSize="2" fontFamily="monospace">
                      {n.id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default FraudNetwork;
