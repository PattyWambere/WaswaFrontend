import React, { useState, useEffect } from 'react';

interface LivePnLProps {
  baseAmount: number;
  tradeId: string;
}

export const LivePnL: React.FC<LivePnLProps> = ({ baseAmount, tradeId }) => {
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    // Small random fluctuation to simulate "market" movement
    const interval = setInterval(() => {
        // Random delta: -0.02% to +0.02% of base amount
        const delta = (Math.random() - 0.5) * (baseAmount * 0.0004);
        
        setPnl(prev => {
            const next = prev + delta;
            
            // Stay within a "realistic" range for a pending trade (+/- 0.5% max)
            const maxRange = baseAmount * 0.005;
            if (Math.abs(next) > maxRange) {
                return next > 0 ? maxRange - Math.random() : -maxRange + Math.random();
            }
            return next;
        });
    }, 300); // Update every 300ms for that "fast market" feel

    return () => clearInterval(interval);
  }, [baseAmount, tradeId]);

  const displayPnL = pnl.toFixed(4);
  const isPositive = pnl >= 0;

  return (
    <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm font-bold transition-all duration-300 ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? '+' : ''}{displayPnL} USDT
            </span>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPositive ? 'bg-success' : 'bg-error'}`} />
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold opacity-50">Live</span>
    </div>
  );
};
