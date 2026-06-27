import { useEffect, useState } from 'react';

interface StartupAnimationProps {
  onComplete: () => void;
}

export default function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [logs] = useState([
    'Initializing workspace...',
    'Loading projects & media buffers...',
    'Preparing interactive sandboxes...',
    'Compiling operating shell...',
    'Welcome back.'
  ]);

  useEffect(() => {
    // Fast increment progress bar to 100 over 1.8s
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + Math.floor(Math.random() * 12) + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Staggered log lines depending on progress percentages
    if (progress > 18 && logIndex === 0) setLogIndex(1);
    if (progress > 45 && logIndex === 1) setLogIndex(2);
    if (progress > 75 && logIndex === 2) setLogIndex(3);
    if (progress >= 100 && logIndex === 3) {
      setLogIndex(4);
      // Let "Welcome back." display briefly, then complete
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, logIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020206] flex items-center justify-center z-50 p-6 select-none font-mono">
      <div className="w-full max-w-sm flex flex-col gap-5 text-left bg-black/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-2xl">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="text-[10px] text-white/30 ml-2">TAYYABA_SH_BOOT.LOG</span>
        </div>

        {/* Dynamic Boot logs */}
        <div className="h-20 flex flex-col justify-end text-[11px] leading-relaxed text-cyan-400/80 select-text">
          {logs.slice(0, logIndex + 1).map((log, index) => (
            <div 
              key={log} 
              className={`transition-opacity duration-300 ${
                index === logIndex ? 'opacity-100 font-bold' : 'opacity-40'
              }`}
            >
              {index === 4 ? (
                <span className="text-emerald-400">✓ {log}</span>
              ) : (
                <span>&gt; {log}</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar visualizer */}
        <div className="space-y-2 shrink-0">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span>Progress</span>
            <span className="text-white/60">{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-100"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
