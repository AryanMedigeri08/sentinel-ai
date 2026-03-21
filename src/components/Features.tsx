import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Brain, TrendingUp, Users, GitBranch } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Real-Time Fraud Detection",
    desc: "Sub-50ms transaction screening using ensemble ML models across billions of data points.",
    stat: "< 50ms",
  },
  {
    icon: BarChart3,
    title: "Dynamic Risk Scoring",
    desc: "Continuously recalculated risk scores based on behavior, device, location, and transaction patterns.",
    stat: "0–100",
  },
  {
    icon: Brain,
    title: "Explainable AI",
    desc: "SHAP-powered explanations showing exactly why a transaction was flagged — no black boxes.",
    stat: "12 factors",
  },
  {
    icon: TrendingUp,
    title: "Future Fraud Prediction",
    desc: "LSTM-based temporal models predict which accounts are likely targets in the next 24 hours.",
    stat: "24hr ahead",
  },
  {
    icon: Users,
    title: "Mule Account Detection",
    desc: "Graph analysis identifies money mule accounts used to launder fraudulent transactions.",
    stat: "94% recall",
  },
  {
    icon: GitBranch,
    title: "Fraud Ring Detection",
    desc: "Graph Neural Networks uncover coordinated fraud rings operating across multiple accounts.",
    stat: "Real-time",
  },
];

const Features = () => (
  <section id="features" className="py-24 md:py-32">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Six Layers of <span className="gradient-text">Intelligent</span> Protection
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Multi-model architecture combining statistical analysis, deep learning, and graph algorithms.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-hover p-6 group cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-primary/60 bg-primary/5 px-2 py-1 rounded">
                {f.stat}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
              {f.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
