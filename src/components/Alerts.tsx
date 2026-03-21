import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

const alertTypes = [
  { icon: MessageSquare, label: "SMS Alert", channel: "SMS" },
  { icon: Mail, label: "Email Alert", channel: "Email" },
  { icon: Bell, label: "Dashboard Alert", channel: "Push" },
];

const Alerts = () => {
  const [sent, setSent] = useState<string[]>([]);

  const handleSend = (channel: string) => {
    setSent((p) => [...p, channel]);
    setTimeout(() => setSent((p) => p.filter((c) => c !== channel)), 3000);
  };

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
            Alert & <span className="gradient-text">Notification</span> System
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Multi-channel real-time alerts for instant fraud response.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {alertTypes.map((a, i) => (
            <motion.div
              key={a.channel}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card p-6 text-center"
            >
              <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mx-auto mb-4">
                <a.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">{a.label}</h4>
              <p className="text-xs text-muted-foreground mb-4">
                "⚠️ Fraud detected for User UPI-8832 — ₹24,500 blocked"
              </p>
              <button
                onClick={() => handleSend(a.channel)}
                disabled={sent.includes(a.channel)}
                className="btn-outline text-xs px-4 py-2 w-full disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {sent.includes(a.channel) ? (
                    <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1.5 text-[hsl(152,70%,48%)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
                    </motion.span>
                  ) : (
                    <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Simulate {a.channel}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alerts;
