import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  status: "safe" | "suspicious" | "fraud";
}

const names = ["Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Meera", "Karan", "Ananya", "Dev", "Neha"];
const statusColors = {
  safe: "text-[hsl(152,70%,48%)]",
  suspicious: "text-[hsl(38,92%,55%)]",
  fraud: "text-[hsl(0,72%,55%)]",
};

const generateTx = (): Transaction => {
  const statuses: Transaction["status"][] = ["safe", "safe", "safe", "safe", "suspicious", "fraud"];
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    sender: names[Math.floor(Math.random() * names.length)],
    receiver: names[Math.floor(Math.random() * names.length)],
    amount: Math.floor(Math.random() * 45000) + 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
};

const TransactionTicker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => Array.from({ length: 20 }, generateTx)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions((prev) => [...prev.slice(1), generateTx()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const items = [...transactions, ...transactions];

  return (
    <div className="w-full overflow-hidden border-t border-b border-white/[0.04] bg-background/50 backdrop-blur-sm py-3">
      <div className="ticker-scroll flex gap-8 whitespace-nowrap">
        {items.map((tx, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className={`w-1.5 h-1.5 rounded-full ${
              tx.status === "safe" ? "bg-[hsl(152,70%,48%)]" :
              tx.status === "suspicious" ? "bg-[hsl(38,92%,55%)]" : "bg-[hsl(0,72%,55%)]"
            }`} />
            <span>{tx.id}</span>
            <span className="text-foreground/40">{tx.sender} → {tx.receiver}</span>
            <span className={statusColors[tx.status]}>₹{tx.amount.toLocaleString()}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TransactionTicker;
