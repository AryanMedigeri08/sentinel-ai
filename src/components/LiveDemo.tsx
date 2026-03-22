import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import RiskGauge from "./RiskGauge";

interface FeatureContribution {
  feature: string;
  contribution: number;
  value: number;
}

interface RiskAssessment {
  fraud_probability: number;
  risk_score: number;
  risk_category: string;
  decision: string;
  feature_contributions: FeatureContribution[];
  is_fraud_predicted: boolean;
}

interface BehavioralAnalysis {
  anomaly_score: number;
  deviations: { factor: string; detail: string }[];
}

interface ScoreResult {
  risk_assessment: RiskAssessment;
  behavioral_analysis: BehavioralAnalysis;
  device_geo_intel: { device_geo_risk: number; risks: { type: string; severity: string; detail: string }[] };
}

const defaultForm = {
  sender: "UPI-1000000001",
  receiver: "UPI-1000000002",
  amount: "24500",
  time: "02:30",
  device: "New Android",
  location: "Mumbai",
};

const featureLabels: Record<string, string> = {
  amount_log: "Transaction Amount",
  amount_zscore: "Amount Deviation",
  hour: "Transaction Hour",
  is_night: "Night Transaction",
  is_weekend: "Weekend",
  device_changed: "Device Change",
  is_new_recipient: "New Recipient",
  geo_distance_km: "Geo Distance",
  txn_count_daily: "Daily Frequency",
  day_of_week: "Day of Week",
};

const LiveDemo = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: form.sender,
          receiver: form.receiver,
          amount: parseFloat(form.amount),
          time: form.time,
          device: form.device,
          location: form.location,
        }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not reach AI engine. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const riskScore = result?.risk_assessment.risk_score ?? 0;
  const status = riskScore < 40 ? "safe" : riskScore < 70 ? "suspicious" : "fraud";
  const StatusIcon = status === "safe" ? CheckCircle2 : status === "suspicious" ? AlertTriangle : XCircle;
  const statusColor = status === "safe" ? "text-[hsl(152,70%,48%)]" : status === "suspicious" ? "text-[hsl(38,92%,55%)]" : "text-[hsl(0,72%,55%)]";

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live <span className="gradient-text">Demo</span> Simulation</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Simulate a UPI transaction and watch the AI engine analyze it in real-time.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Transaction Input</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ["sender", "Sender ID"], ["receiver", "Receiver ID"], ["amount", "Amount (₹)"],
                ["time", "Time (HH:MM)"], ["device", "Device Type"], ["location", "Location"],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
                  <input className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-white/[0.06] text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" value={form[key]} onChange={(e) => update(key, e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={handleSimulate} disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>) : (<><Send className="w-4 h-4" /> Analyze Transaction</>)}
            </button>
          </motion.div>

          {/* Output */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-6">AI Analysis Result</h3>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                  </div>
                  <div className="text-sm text-muted-foreground">Running XGBoost + SHAP models...</div>
                  <div className="flex gap-1">
                    {["Feature extraction", "Behavioral profiling", "SHAP explanation"].map((s, i) => (
                      <motion.span key={s} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5, duration: 0.3 }} className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">{s}</motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-center text-destructive text-sm">{error}</motion.div>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-6">
                    <RiskGauge score={riskScore} />
                    <div>
                      <div className={`flex items-center gap-2 text-lg font-bold ${statusColor}`}>
                        <StatusIcon className="w-5 h-5" />
                        {result.risk_assessment.risk_category}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Probability: <span className="text-foreground font-mono">{(result.risk_assessment.fraud_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Decision: <span className={`font-mono font-bold ${result.risk_assessment.decision === "BLOCK" ? "text-[hsl(0,72%,55%)]" : result.risk_assessment.decision === "OTP_REVERIFY" ? "text-[hsl(38,92%,55%)]" : "text-[hsl(152,70%,48%)]"}`}>{result.risk_assessment.decision}</span>
                      </div>
                    </div>
                  </div>

                  {/* SHAP feature contributions */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">SHAP Feature Contributions</div>
                    <div className="flex flex-col gap-1.5">
                      {result.risk_assessment.feature_contributions.slice(0, 5).map((c, i) => (
                        <motion.div key={c.feature} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-2 text-sm bg-secondary/30 px-3 py-1.5 rounded-lg">
                          <span className={`font-mono text-xs font-bold min-w-[50px] ${c.contribution > 0 ? "text-[hsl(0,72%,55%)]" : "text-[hsl(152,70%,48%)]"}`}>
                            {c.contribution > 0 ? "+" : ""}{c.contribution.toFixed(3)}
                          </span>
                          <span className="text-foreground/80 text-xs">{featureLabels[c.feature] || c.feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral deviations */}
                  {result.behavioral_analysis.deviations.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Behavioral Analysis</div>
                      {result.behavioral_analysis.deviations.slice(0, 3).map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-foreground/70 bg-secondary/20 px-3 py-1.5 rounded-lg mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${d.factor === "normal" ? "bg-[hsl(152,70%,48%)]" : "bg-[hsl(38,92%,55%)]"}`} />
                          {d.detail}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Enter transaction details and click Analyze
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
