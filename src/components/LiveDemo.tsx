import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import RiskGauge from "./RiskGauge";

interface SimResult {
  riskScore: number;
  status: "safe" | "suspicious" | "fraud";
  confidence: number;
  reasons: string[];
}

const defaultForm = {
  sender: "UPI-9876543210",
  receiver: "UPI-1234567890",
  amount: "24500",
  time: "02:30",
  device: "New Android",
  location: "Mumbai",
};

const simulateFraud = (form: typeof defaultForm): SimResult => {
  let score = Math.floor(Math.random() * 30) + 10;
  const reasons: string[] = [];
  const amt = parseInt(form.amount);

  if (amt > 20000) { score += 25; reasons.push(`High amount anomaly: ₹${amt.toLocaleString()}`); }
  const hour = parseInt(form.time.split(":")[0]);
  if (hour < 5 || hour > 23) { score += 20; reasons.push(`Unusual transaction time: ${form.time}`); }
  if (form.device.toLowerCase().includes("new")) { score += 15; reasons.push("New device detected"); }
  if (form.sender === form.receiver) { score += 30; reasons.push("Self-transfer pattern detected"); }

  score = Math.min(score, 98);
  const status = score < 40 ? "safe" : score < 70 ? "suspicious" : "fraud";
  const confidence = 85 + Math.random() * 12;

  if (reasons.length === 0) reasons.push("Transaction within normal parameters");

  return { riskScore: score, status, confidence: Math.round(confidence * 10) / 10, reasons };
};

const LiveDemo = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);

  const handleSimulate = useCallback(() => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateFraud(form));
      setLoading(false);
    }, 1800);
  }, [form]);

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const StatusIcon = result?.status === "safe" ? CheckCircle2 :
    result?.status === "suspicious" ? AlertTriangle : XCircle;

  const statusColor = result?.status === "safe" ? "text-[hsl(152,70%,48%)]" :
    result?.status === "suspicious" ? "text-[hsl(38,92%,55%)]" : "text-[hsl(0,72%,55%)]";

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live <span className="gradient-text">Demo</span> Simulation
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Simulate a UPI transaction and watch the AI engine analyze it in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Transaction Input</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ["sender", "Sender ID"],
                ["receiver", "Receiver ID"],
                ["amount", "Amount (₹)"],
                ["time", "Time (HH:MM)"],
                ["device", "Device Type"],
                ["location", "Location"],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-white/[0.06] text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Send className="w-4 h-4" /> Simulate Transaction</>
              )}
            </button>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-6">Analysis Result</h3>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                  </div>
                  <div className="text-sm text-muted-foreground">Running AI models...</div>
                  <div className="flex gap-1">
                    {["Feature extraction", "Anomaly detection", "Risk scoring"].map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.5, duration: 0.3 }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-6">
                    <RiskGauge score={result.riskScore} />
                    <div>
                      <div className={`flex items-center gap-2 text-lg font-bold ${statusColor}`}>
                        <StatusIcon className="w-5 h-5" />
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Confidence: <span className="text-foreground font-mono">{result.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
                      Explanation
                    </div>
                    <div className="flex flex-col gap-2">
                      {result.reasons.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-sm text-foreground/80 bg-secondary/30 px-3 py-2 rounded-lg"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            result.status === "safe" ? "bg-[hsl(152,70%,48%)]" :
                            result.status === "suspicious" ? "bg-[hsl(38,92%,55%)]" : "bg-[hsl(0,72%,55%)]"
                          }`} />
                          {r}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex items-center justify-center text-muted-foreground text-sm"
                >
                  Simulate a transaction to see the analysis
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
