import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { ShieldAlert, ShieldCheck, TrendingDown, Activity } from "lucide-react";

const pieData = [
  { name: "Legitimate", value: 94.3 },
  { name: "Suspicious", value: 3.8 },
  { name: "Fraud", value: 1.9 },
];
const pieColors = ["hsl(152,70%,48%)", "hsl(38,92%,55%)", "hsl(0,72%,55%)"];

const riskDist = [
  { range: "0-10", count: 4200 }, { range: "10-20", count: 3100 },
  { range: "20-30", count: 1800 }, { range: "30-40", count: 900 },
  { range: "40-50", count: 520 }, { range: "50-60", count: 340 },
  { range: "60-70", count: 180 }, { range: "70-80", count: 95 },
  { range: "80-90", count: 42 }, { range: "90-100", count: 18 },
];

const timeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  transactions: Math.floor(Math.random() * 5000) + 1000,
  frauds: Math.floor(Math.random() * 30) + (i < 5 || i > 22 ? 20 : 3),
}));

const suspiciousAccounts = [
  { id: "UPI-8832910455", score: 94, txns: 47, amount: "₹18,42,000", flag: "Mule pattern" },
  { id: "UPI-7721034512", score: 87, txns: 23, amount: "₹7,65,300", flag: "Ring member" },
  { id: "UPI-9910234876", score: 82, txns: 156, amount: "₹34,12,800", flag: "Velocity spike" },
  { id: "UPI-6654312098", score: 78, txns: 12, amount: "₹4,50,000", flag: "New device" },
  { id: "UPI-5543210987", score: 73, txns: 89, amount: "₹12,34,500", flag: "Geo anomaly" },
];

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(interval); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return <span>{val.toLocaleString()}{suffix}</span>;
};

const Dashboard = () => (
  <section id="dashboard" className="py-24 md:py-32 border-t border-white/[0.04]">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Analytics <span className="gradient-text">Dashboard</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Real-time monitoring and analytics across all UPI transactions.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Activity, label: "Total Transactions", value: 1247893, color: "text-primary" },
          { icon: ShieldAlert, label: "Fraud Detected", value: 2847, color: "text-[hsl(0,72%,55%)]" },
          { icon: ShieldCheck, label: "Fraud Prevented", value: 2691, color: "text-[hsl(152,70%,48%)]" },
          { icon: TrendingDown, label: "False Positives Reduced", value: 67, suffix: "%", color: "text-[hsl(38,92%,55%)]" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="glass-card p-5"
          >
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <div className={`text-2xl font-bold font-mono ${s.color}`}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* Pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-5"
        >
          <h4 className="text-sm font-semibold mb-4">Transaction Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222,40%,10%)", border: "1px solid hsl(222,30%,20%)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "hsl(210,40%,96%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                {d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-5"
        >
          <h4 className="text-sm font-semibold mb-4">Risk Score Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(222,40%,10%)", border: "1px solid hsl(222,30%,20%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(190,95%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-5"
        >
          <h4 className="text-sm font-semibold mb-4">Transactions Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(222,40%,10%)", border: "1px solid hsl(222,30%,20%)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="transactions" stroke="hsl(190,95%,55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="frauds" stroke="hsl(0,72%,55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card p-5 overflow-x-auto"
      >
        <h4 className="text-sm font-semibold mb-4">Top Suspicious Accounts</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-white/[0.06]">
              <th className="text-left py-2 font-medium">Account ID</th>
              <th className="text-left py-2 font-medium">Risk Score</th>
              <th className="text-left py-2 font-medium">Transactions</th>
              <th className="text-left py-2 font-medium">Volume</th>
              <th className="text-left py-2 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {suspiciousAccounts.map((a) => (
              <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 font-mono text-xs">{a.id}</td>
                <td className="py-2.5">
                  <span className={`font-mono font-bold ${a.score >= 80 ? "text-[hsl(0,72%,55%)]" : "text-[hsl(38,92%,55%)]"}`}>
                    {a.score}
                  </span>
                </td>
                <td className="py-2.5 font-mono">{a.txns}</td>
                <td className="py-2.5 font-mono">{a.amount}</td>
                <td className="py-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                    {a.flag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export default Dashboard;
