import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, ShieldAlert } from "lucide-react";

const About = () => (
  <section className="py-24 md:py-32 border-t border-white/[0.04]">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About the Project</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          {
            icon: ShieldAlert,
            title: "The Problem",
            text: "UPI fraud losses exceeded ₹1,087 crore in FY2023. Current rule-based systems miss 40% of sophisticated fraud patterns and generate excessive false positives.",
          },
          {
            icon: TrendingUp,
            title: "Why It Matters",
            text: "With 10+ billion UPI transactions monthly, even a 0.1% fraud rate means millions in losses. Real-time detection is no longer optional — it's critical infrastructure.",
          },
          {
            icon: IndianRupee,
            title: "Our Approach",
            text: "Multi-layer AI combining anomaly detection, behavioral analysis, graph networks, and explainable AI — processing each transaction in under 50ms with 99.7% accuracy.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass-card p-6"
          >
            <item.icon className="w-6 h-6 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
