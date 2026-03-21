import { motion } from "framer-motion";
import { Brain, TreeDeciduous, GitBranch, Activity } from "lucide-react";

const models = [
  {
    icon: Brain,
    name: "Isolation Forest",
    purpose: "Anomaly Detection",
    why: "Isolates outlier transactions that deviate from normal spending patterns without requiring labeled fraud data.",
    output: "Anomaly score (0–1)",
  },
  {
    icon: TreeDeciduous,
    name: "XGBoost / Random Forest",
    purpose: "Fraud Classification",
    why: "Gradient-boosted trees provide high accuracy on tabular transaction features with fast inference time.",
    output: "Fraud probability + feature importance",
  },
  {
    icon: GitBranch,
    name: "Graph Neural Networks",
    purpose: "Fraud Ring Detection",
    why: "Learns relational patterns between accounts to identify coordinated fraud networks invisible to traditional models.",
    output: "Community clusters + suspicious subgraphs",
  },
  {
    icon: Activity,
    name: "LSTM Network",
    purpose: "Behavior Prediction",
    why: "Captures temporal sequences in user behavior to predict future fraud likelihood and detect behavior drift.",
    output: "24-hour risk forecast per user",
  },
];

const AIModels = () => (
  <section id="models" className="py-24 md:py-32 border-t border-white/[0.04]">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          AI <span className="gradient-text">Models</span> Architecture
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Ensemble of specialized models working together for maximum detection accuracy.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-hover p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{m.name}</h3>
                <span className="text-xs text-primary font-mono">{m.purpose}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{m.why}</p>
            <div className="text-xs font-mono text-foreground/60 bg-secondary/30 px-3 py-2 rounded-lg">
              Output → {m.output}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AIModels;
