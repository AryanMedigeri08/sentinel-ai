import { motion } from "framer-motion";

const RiskGauge = ({ score }: { score: number }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score < 40 ? "hsl(152,70%,48%)" : score < 70 ? "hsl(38,92%,55%)" : "hsl(0,72%,55%)";

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="hsl(222,30%,16%)" strokeWidth="6"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-xl font-bold font-mono"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
};

export default RiskGauge;
