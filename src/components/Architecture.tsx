import { motion } from "framer-motion";

const steps = [
  { label: "User", sub: "UPI App", color: "primary" },
  { label: "Transaction", sub: "UPI Gateway", color: "primary" },
  { label: "Feature Extraction", sub: "200+ signals", color: "accent" },
  { label: "AI Models", sub: "Ensemble", color: "accent" },
  { label: "Risk Engine", sub: "Score 0-100", color: "primary" },
  { label: "Decision", sub: "Allow/Block", color: "primary" },
  { label: "Alert System", sub: "SMS / Push", color: "accent" },
  { label: "Dashboard", sub: "Monitoring", color: "primary" },
];

const engines = ["ML Models", "Graph Analysis", "Rule Engine", "Behavioral Engine"];

const Architecture = () => (
  <section className="py-24 md:py-32 border-t border-white/[0.04]">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">System Architecture</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          End-to-end fraud detection pipeline processing transactions in under 50ms.
        </p>
      </motion.div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="glass-card p-8 overflow-x-auto"
      >
        <div className="flex items-center gap-2 min-w-[800px]">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="text-xs font-semibold text-foreground">{s.label}</span>
                <span className="text-[10px] text-muted-foreground">{s.sub}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-px bg-gradient-to-r from-primary/40 to-primary/10 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Engine labels */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {engines.map((e) => (
            <span
              key={e}
              className="text-[10px] font-mono px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent"
            >
              {e}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Architecture;
