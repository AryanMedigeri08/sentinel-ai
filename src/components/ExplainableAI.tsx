import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const factors = [
  { name: "High Amount", impact: 35, color: "hsl(0,72%,55%)" },
  { name: "New Device", impact: 20, color: "hsl(38,92%,55%)" },
  { name: "Odd Hour", impact: 15, color: "hsl(38,92%,55%)" },
  { name: "Location Change", impact: 12, color: "hsl(190,95%,55%)" },
  { name: "Frequency Spike", impact: 10, color: "hsl(190,95%,55%)" },
  { name: "Receiver History", impact: 8, color: "hsl(215,20%,55%)" },
];

const ExplainableAI = () => (
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
          Explainable <span className="gradient-text">AI</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          SHAP-powered feature importance — no black boxes. Every flag comes with a reason.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-semibold mb-4">Feature Importance</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={factors} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} domain={[0, 40]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(210,40%,96%)" }} width={110} />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                {factors.map((f, i) => (
                  <Cell key={i} fill={f.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-semibold mb-4">Transaction Flagged Due To:</h4>
          <div className="space-y-3">
            {factors.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 text-right font-mono text-sm font-bold" style={{ color: f.color }}>
                  +{f.impact}%
                </div>
                <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.impact * 2.5}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: f.color }}
                  />
                </div>
                <span className="text-sm text-foreground/80 min-w-[120px]">{f.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ExplainableAI;
