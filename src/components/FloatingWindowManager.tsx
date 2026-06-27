import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, Github, ChevronRight, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, FileText, Calendar, Compass, ShieldAlert, Award, FolderOpen, Heart } from 'lucide-react';
import { Project, Article, CertificateFolder, Certificate, FloatingWindow } from '../types';
import { PROJECTS, ARTICLES, CERTIFICATE_FOLDERS, ACCENTS } from '../data';

interface FloatingWindowManagerProps {
  windows: FloatingWindow[];
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onUpdateWindowPosition: (id: string, x: number, y: number) => void;
  accentColor: string;
}

export default function FloatingWindowManager({
  windows,
  onCloseWindow,
  onMinimizeWindow,
  onFocusWindow,
  onUpdateWindowPosition,
  accentColor,
}: FloatingWindowManagerProps) {
  const [dragState, setDragState] = useState<{ windowId: string; startX: number; startY: number; windowStartX: number; windowStartY: number } | null>(null);
  
  // App states inside floating windows
  // 1. Red Light Green Light Game
  const [rlState, setRlState] = useState<'idle' | 'green' | 'red' | 'eliminated' | 'win'>('idle');
  const [rlScore, setRlScore] = useState(0);
  const [rlTimer, setRlTimer] = useState(10);
  
  // 2. Venting Platform
  const [ventText, setVentText] = useState('');
  const [ventEnvelopes, setVentEnvelopes] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  
  // 3. SpotDemo Media Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Are We Getting Bored More Easily Than Before? - Synth Ambient Mix');
  const [playProgress, setPlayProgress] = useState(30);

  // 4. Budget Tracker Demo
  const [budgetLogs, setBudgetLogs] = useState([
    { id: '1', title: 'Coffee & Snack', amount: 150, category: 'Food' },
    { id: '2', title: 'Bus ride (Local)', amount: 40, category: 'Travel' },
    { id: '3', title: 'Internet renewal', amount: 800, category: 'Utilities' }
  ]);
  const [budgetTitle, setBudgetTitle] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('Food');

  // 5. Calculator State
  const [calcVal, setCalcVal] = useState('0');

  // 6. Certificate Zoom & Document Viewer
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Drag listeners
  const startDrag = (id: string, e: React.MouseEvent) => {
    onFocusWindow(id);
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const target = e.target as HTMLElement;
    if (target.closest('.window-control-btn') || target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) return;

    setDragState({
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      windowStartX: win.x,
      windowStartY: win.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      
      const newX = dragState.windowStartX + dx;
      const newY = dragState.windowStartY + dy;
      
      onUpdateWindowPosition(dragState.windowId, newX, newY);
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  // RED LIGHT GREEN LIGHT loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rlState === 'green' || rlState === 'red') {
      interval = setInterval(() => {
        setRlTimer((prev) => {
          if (prev <= 1) {
            // Game Over Time Out
            setRlState('eliminated');
            return 0;
          }
          return prev - 1;
        });

        // Randomly toggle red / green
        if (Math.random() > 0.6) {
          setRlState((prev) => (prev === 'green' ? 'red' : 'green'));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rlState]);

  const startRlGame = () => {
    setRlState('green');
    setRlScore(0);
    setRlTimer(15);
  };

  const handleRlStep = () => {
    if (rlState === 'red') {
      setRlState('eliminated');
    } else if (rlState === 'green') {
      const nextScore = rlScore + 10;
      setRlScore(nextScore);
      if (nextScore >= 100) {
        setRlState('win');
      }
    }
  };

  // SPOTDEMO timeline
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isPlaying) {
      t = setInterval(() => {
        setPlayProgress((p) => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isPlaying]);

  // VENTING platform dissolve
  const handleVentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim()) return;
    const newEnv = {
      id: Math.random().toString(),
      text: ventText,
      x: Math.floor(Math.random() * 80) + 10,
      y: 90
    };
    setVentEnvelopes((prev) => [...prev, newEnv]);
    setVentText('');

    // Dissolve over time
    setTimeout(() => {
      setVentEnvelopes((prev) => prev.filter((env) => env.id !== newEnv.id));
    }, 5500);
  };

  // BUDGET tracker arithmetic
  const handleBudgetAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetTitle.trim() || !budgetAmount) return;
    const item = {
      id: Math.random().toString(),
      title: budgetTitle,
      amount: parseFloat(budgetAmount),
      category: budgetCategory
    };
    setBudgetLogs((prev) => [item, ...prev]);
    setBudgetTitle('');
    setBudgetAmount('');
  };

  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  return (
    <>
      {/* Draggable floating windows workspace overlay */}
      {windows.map((win) => {
        if (!win.isOpen || win.isMinimized) return null;

        return (
          <div
            key={win.id}
            onMouseDown={() => onFocusWindow(win.id)}
            style={{
              position: 'fixed',
              left: `${win.x}px`,
              top: `${win.y}px`,
              width: `${win.width}px`,
              height: `${win.height}px`,
              zIndex: win.zIndex,
            }}
            className="rounded-2xl glass-panel border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all duration-100 ease-out animate-in fade-in zoom-in-95"
          >
            {/* Header Control Rail */}
            <div
              onMouseDown={(e) => startDrag(win.id, e)}
              className="h-10 bg-black/40 border-b border-white/5 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium tracking-tight text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeAccent.hex }} />
                  {win.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMinimizeWindow(win.id)}
                  className="window-control-btn w-6 h-6 hover:bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white cursor-pointer transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onCloseWindow(win.id)}
                  className="window-control-btn w-6 h-6 hover:bg-rose-500/10 hover:text-rose-400 rounded-full flex items-center justify-center text-white/40 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Interior Panel */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 no-scrollbar relative text-white/90">
              
              {/* SECTION 1: PROJECT CONTENT */}
              {win.type === 'project' && (() => {
                const proj = PROJECTS.find((p) => p.id === win.contentId);
                if (!proj) return <p>Project details not found.</p>;

                return (
                  <div className="flex flex-col gap-6 font-sans">
                    {/* Header Details */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-2xl">{proj.symbol}</span>
                        <h3 className="text-xl font-display font-semibold tracking-tight text-white">
                          {proj.title}
                        </h3>
                      </div>
                      <p className="text-xs font-mono" style={{ color: activeAccent.hex }}>
                        {proj.technologies.join(' / ')}
                      </p>
                    </div>

                    {/* Interactive Sandbox Showcase */}
                    <div className="border border-white/5 bg-black/35 rounded-xl p-4 overflow-hidden relative min-h-[160px] flex flex-col justify-center">
                      
                      {/* Interactive sandbox: RED LIGHT GREEN LIGHT */}
                      {proj.id === 'red-light-green-light' && (
                        <div className="text-center flex flex-col items-center gap-3 select-none">
                          <div className="flex items-center gap-4">
                            <span className={`w-4 h-4 rounded-full ${rlState === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-emerald-950/20'}`} />
                            <span className={`w-4 h-4 rounded-full ${rlState === 'red' ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-rose-950/20'}`} />
                          </div>

                          <div className="text-xs font-mono">
                            {rlState === 'idle' && <span className="text-white/40">Ready to play?</span>}
                            {rlState === 'green' && <span className="text-emerald-400 font-bold animate-pulse">RUN! CLICK STEP BUTTON</span>}
                            {rlState === 'red' && <span className="text-rose-500 font-bold">FREEZE! STOP CLICKING</span>}
                            {rlState === 'eliminated' && <span className="text-rose-400 font-bold">❌ ELIMINATED! Reaction penalty trigger.</span>}
                            {rlState === 'win' && <span className="text-cyan-400 font-bold">🏆 YOU CROSSED THE LINE! PERFECT SPRINT.</span>}
                          </div>

                          <div className="flex items-center gap-6 text-xs font-mono">
                            <div>Score: <span className="text-white font-bold">{rlScore}</span>/100</div>
                            <div>Timer: <span className="text-white font-bold">{rlTimer}s</span></div>
                          </div>

                          {rlState === 'idle' || rlState === 'eliminated' || rlState === 'win' ? (
                            <button
                              onClick={startRlGame}
                              className="px-4 py-1.5 rounded-full text-xs font-mono border text-white hover:bg-white/5 cursor-pointer border-white/10"
                            >
                              Start Run
                            </button>
                          ) : (
                            <button
                              onClick={handleRlStep}
                              className="px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white transition-all duration-150 cursor-pointer"
                              style={{ backgroundColor: rlState === 'green' ? activeAccent.hex : '#f43f5e' }}
                            >
                              Step Forward
                            </button>
                          )}
                        </div>
                      )}

                      {/* Interactive sandbox: VENTING PLATFORM */}
                      {proj.id === 'venting-platform' && (
                        <div className="relative h-44 overflow-hidden flex flex-col justify-end text-center">
                          {/* Floating Envelopes container */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {ventEnvelopes.map((env) => (
                              <div
                                key={env.id}
                                className="absolute bg-white/5 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-cyan-300 animate-bounce transition-all duration-1000"
                                style={{
                                  left: `${env.x}%`,
                                  bottom: '10px',
                                  transform: 'translateY(-120px)',
                                  opacity: 0,
                                  transition: 'transform 5s linear, opacity 5s ease-out'
                                }}
                                ref={(el) => {
                                  if (el) {
                                    // Trigger slide upwards
                                    setTimeout(() => {
                                      el.style.transform = 'translateY(-180px) scale(0.6)';
                                      el.style.opacity = '1';
                                    }, 20);
                                    setTimeout(() => {
                                      el.style.opacity = '0';
                                    }, 4000);
                                  }
                                }}
                              >
                                ✉ {env.text.slice(0, 15)}...
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleVentSubmit} className="flex gap-2 p-1 bg-black/20 border border-white/5 rounded-xl z-10">
                            <input
                              type="text"
                              placeholder="Write a random thought and float it..."
                              value={ventText}
                              onChange={(e) => setVentText(e.target.value)}
                              className="flex-1 bg-transparent text-xs p-2 outline-none border-0 focus:ring-0 placeholder-white/30 text-white"
                            />
                            <button
                              type="submit"
                              className="px-3.5 rounded-lg text-[10px] font-mono font-bold text-black uppercase cursor-pointer"
                              style={{ backgroundColor: activeAccent.hex }}
                            >
                              Float Away
                            </button>
                          </form>
                          <span className="text-[9px] font-mono text-white/30 block mt-1.5">
                            Submitted digital items will undergo a CSS dissolve timer over 5 seconds.
                          </span>
                        </div>
                      )}

                      {/* Interactive sandbox: SPOTDEMO */}
                      {proj.id === 'spotdemo' && (
                        <div className="flex flex-col gap-3 font-sans max-w-sm mx-auto w-full">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-xl shadow-lg border border-white/5">
                              ♫
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="text-xs font-semibold text-white truncate">{currentTrack}</div>
                              <div className="text-[10px] text-white/50 font-mono">SpotDemo Media Node</div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-2 text-[8px] font-mono text-white/40">
                            <span>0:45</span>
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400" style={{ width: `${playProgress}%`, backgroundColor: activeAccent.hex }} />
                            </div>
                            <span>3:20</span>
                          </div>

                          {/* Player buttons */}
                          <div className="flex items-center justify-center gap-4 mt-1">
                            <button
                              onClick={() => {
                                setPlayProgress(0);
                                setCurrentTrack('A Tiny Operating System in the Browser - Dev Ambient Mix');
                              }}
                              className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer"
                            >
                              Prev
                            </button>
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            >
                              <span className="text-xs">{isPlaying ? '⏸' : '▶'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setPlayProgress(0);
                                setCurrentTrack('Are We Getting Bored More Easily Than Before? - Synth Ambient Mix');
                              }}
                              className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Interactive sandbox: BUDGET TRACKER */}
                      {proj.id === 'budget-tracker' && (
                        <div className="flex flex-col md:flex-row gap-4 font-sans select-none">
                          <div className="flex-1">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">Transaction Ledger</div>
                            <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                              {budgetLogs.map((log) => (
                                <div key={log.id} className="flex justify-between items-center text-[10px] bg-white/[0.03] p-1.5 rounded border border-white/5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-mono text-white/40 bg-white/5 px-1 rounded">{log.category}</span>
                                    <span className="text-white/80">{log.title}</span>
                                  </div>
                                  <span className="font-mono text-cyan-400 font-medium" style={{ color: activeAccent.hex }}>₹{log.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <form onSubmit={handleBudgetAdd} className="w-full md:w-40 flex flex-col gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 shrink-0">
                            <input
                              type="text"
                              placeholder="Label"
                              value={budgetTitle}
                              onChange={(e) => setBudgetTitle(e.target.value)}
                              className="bg-transparent border border-white/10 rounded p-1 text-[10px] outline-none text-white focus:border-cyan-400"
                            />
                            <input
                              type="number"
                              placeholder="Amount"
                              value={budgetAmount}
                              onChange={(e) => setBudgetAmount(e.target.value)}
                              className="bg-transparent border border-white/10 rounded p-1 text-[10px] outline-none text-white focus:border-cyan-400"
                            />
                            <button
                              type="submit"
                              className="py-1 rounded bg-white text-black text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                            >
                              Add Log
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Interactive sandbox: CALCULATOR */}
                      {proj.id === 'calculator' && (
                        <div className="max-w-[160px] mx-auto w-full select-none">
                          <div className="bg-black/40 rounded-lg p-2 text-right text-sm font-mono text-cyan-400 font-bold tracking-tight mb-2 truncate" style={{ color: activeAccent.hex }}>
                            {calcVal}
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
                            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                              <button
                                key={btn}
                                onClick={() => {
                                  if (btn === 'C') setCalcVal('0');
                                  else if (btn === '=') {
                                    try {
                                      // safe eval with basic sanitize
                                      const sanitized = calcVal.replace(/[^0-9+\-*/.]/g, '');
                                      const result = new Function(`return ${sanitized}`)();
                                      setCalcVal(parseFloat(result.toFixed(4)).toString());
                                    } catch {
                                      setCalcVal('Err');
                                    }
                                  } else {
                                    setCalcVal((p) => (p === '0' || p === 'Err' ? btn : p + btn));
                                  }
                                }}
                                className="h-6 rounded bg-white/[0.04] border border-white/5 flex items-center justify-center font-bold text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Generic Placeholder for other (like Mini OS desktop, which is explained inside main interface) */}
                      {proj.id === 'mini-os' && (
                        <div className="text-center font-sans">
                          <Compass className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" style={{ color: activeAccent.hex }} />
                          <div className="text-xs font-semibold text-white mb-0.5">Desktop Environment Online</div>
                          <p className="text-[10px] text-white/50 leading-relaxed max-w-xs mx-auto">
                            Mini OS runs as the visual centerpiece of the home layout. Click outside this window to interact with the mockup!
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Challenge and Takeaways panel */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-white/45 mb-1.5">
                          Description
                        </h4>
                        <p className="text-xs font-sans leading-relaxed text-white/70">
                          {proj.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-widest text-white/45 mb-1.5">
                            Challenges Overcome
                          </h4>
                          <p className="text-xs font-sans leading-relaxed text-white/70">
                            {proj.challenges}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-widest text-white/45 mb-1.5">
                            Key Learnings
                          </h4>
                          <p className="text-xs font-sans leading-relaxed text-white/70">
                            {proj.whatLearned}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-3 pt-2 border-t border-white/5 mt-4">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono font-medium text-black px-4 py-2 rounded-xl transition-all duration-300 hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: activeAccent.hex }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono font-medium border border-white/10 hover:border-white/20 text-white/80 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer bg-white/[0.02]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SECTION 2: ARTICLE READING CONTENT */}
              {win.type === 'article' && (() => {
                const article = ARTICLES.find((a) => a.id === win.contentId);
                if (!article) return <p>Article not found.</p>;

                // Calculate Reading Progress Line
                return (
                  <div className="flex flex-col gap-6 font-sans select-text">
                    
                    {/* Header Magazine Meta */}
                    <div className="border-b border-white/5 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-mono text-white/45">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-white/70">
                          {article.date}
                        </span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <div className="flex gap-1">
                          {article.topics.map((t) => (
                            <span key={t} className="text-cyan-400" style={{ color: activeAccent.hex }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-display font-bold tracking-tight text-white mb-2 leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-xs text-white/50 leading-relaxed font-sans font-normal italic">
                        {article.description}
                      </p>
                    </div>

                    {/* Rich Cover Image (with referrerPolicy as per standard) */}
                    <div className="w-full h-44 rounded-xl overflow-hidden border border-white/5 select-none shrink-0 relative">
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover brightness-[0.7] contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Magazine Typography Layout */}
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/80 font-sans space-y-4">
                      
                      {/* Simple Markdown Parser / Custom Styled Content Render */}
                      {article.content.split('\n\n').map((paragraph, index) => {
                        const trimmed = paragraph.trim();
                        if (trimmed.startsWith('# ')) {
                          return null; // hide main title
                        }
                        if (trimmed.startsWith('## ')) {
                          return (
                            <h4 key={index} className="text-sm font-mono font-semibold text-white tracking-wide uppercase pt-4 border-b border-white/5 pb-1">
                              {trimmed.replace('## ', '')}
                            </h4>
                          );
                        }
                        if (trimmed.startsWith('```')) {
                          const code = trimmed.replace(/```[a-z]*/, '').replace(/```$/, '').trim();
                          return (
                            <pre key={index} className="bg-black/40 border border-white/5 p-3 rounded-lg overflow-x-auto font-mono text-[10px] text-cyan-300/90 select-text leading-normal">
                              <code>{code}</code>
                            </pre>
                          );
                        }

                        // Apply Drop Cap strictly to the first non-header paragraph
                        if (index === 1 && /^[A-Z]/.test(trimmed)) {
                          const firstChar = trimmed.charAt(0);
                          const remainingText = trimmed.slice(1);
                          return (
                            <p key={index} className="text-sm leading-relaxed text-white/85">
                              <span 
                                className="float-left text-3xl font-display font-bold mr-2 mt-1 leading-[0.8]"
                                style={{ color: activeAccent.hex }}
                              >
                                {firstChar}
                              </span>
                              {remainingText}
                            </p>
                          );
                        }

                        return (
                          <p key={index} className="text-sm leading-relaxed text-white/80">
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>

                    {/* Reading end badge */}
                    <div className="border-t border-white/5 pt-6 mt-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-white/40">
                        <Heart className="w-3 h-3 text-rose-500 animate-pulse" />
                        <span>Thanks for finishing.</span>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* SECTION 3: CERTIFICATES ARCHIVE CONTENT */}
              {win.type === 'certificate' && (() => {
                const folder = CERTIFICATE_FOLDERS.find((f) => f.id === win.contentId);
                if (!folder) return <p>Archive folder not found.</p>;

                return (
                  <div className="flex flex-col gap-6 font-sans">
                    
                    {/* Folder Title and count */}
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <FolderOpen className="w-5 h-5 text-cyan-400 shrink-0" style={{ color: activeAccent.hex }} />
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-none">
                          {folder.name}
                        </h4>
                        <span className="text-[10px] font-mono text-white/40">
                          {folder.certificates.length} items logged
                        </span>
                      </div>
                    </div>

                    {/* Certificate Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                      {folder.certificates.map((cert) => (
                        <div
                          key={cert.name}
                          onClick={() => {
                            setSelectedCert(cert);
                            setZoomLevel(1);
                          }}
                          className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-2.5 cursor-pointer text-left transition-all duration-300 group hover:bg-white/[0.04]"
                        >
                          {/* Mini Document preview thumbnail placeholder */}
                          <div className="aspect-[3/4] bg-zinc-950/40 rounded-lg overflow-hidden border border-white/5 relative mb-2 flex items-center justify-center">
                            <img
                              src={cert.url}
                              alt={cert.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover brightness-[0.6] group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[9px] font-mono bg-white text-black px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                                View
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-[10px] font-semibold text-white line-clamp-1 leading-tight group-hover:text-cyan-400 transition-colors">
                            {cert.name}
                          </div>
                          <div className="text-[8px] font-mono text-white/35 mt-0.5">
                            {cert.issuer}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })()}

            </div>
          </div>
        );
      })}

      {/* MODAL OVERLAY: FULLSCREEN CERTIFICATE VIEWER WITH ZOOM */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-[#000]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in">
          
          <div className="relative w-full max-w-xl glass-panel-deep rounded-2xl border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Viewer Header with control elements */}
            <div className="h-12 bg-black/30 border-b border-white/5 px-4 flex items-center justify-between shrink-0 select-none">
              <div className="overflow-hidden pr-4">
                <div className="text-xs font-semibold text-white truncate">{selectedCert.name}</div>
                <div className="text-[9px] font-mono text-white/40">{selectedCert.issuer} • {selectedCert.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono text-white/40 w-10 text-center select-none">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-8 h-8 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-950/20">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="max-w-full origin-center shadow-2xl rounded-lg border border-white/5 overflow-hidden"
              >
                <img
                  src={selectedCert.url}
                  alt={selectedCert.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] object-contain w-auto h-auto"
                />
              </div>
            </div>

            {/* Viewer Footer */}
            <div className="px-4 py-2 bg-black/20 border-t border-white/5 text-center text-[9px] font-mono text-white/30 shrink-0">
              Document zoom enabled. Close or click ESC to return to folder.
            </div>

          </div>
        </div>
      )}
    </>
  );
}
