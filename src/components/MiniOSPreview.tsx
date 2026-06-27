import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Keyboard, ShieldAlert, Minimize2, Maximize2, X, RefreshCw, Send, Check } from 'lucide-react';
import { PROJECTS } from '../data';

interface OSWindow {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export default function MiniOSPreview() {
  // Desktop OS State
  const [windows, setWindows] = useState<OSWindow[]>([
    { id: 'notepad', title: 'Notepad', x: 20, y: 30, width: 220, height: 180, isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'calculator', title: 'Calculator', x: 260, y: 30, width: 190, height: 230, isOpen: false, isMinimized: false, zIndex: 1 },
    { id: 'terminal', title: 'Terminal', x: 80, y: 100, width: 340, height: 200, isOpen: true, isMinimized: false, zIndex: 2 }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string>('terminal');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [systemTime, setSystemTime] = useState('');
  
  // App-specific internal states
  const [notepadText, setNotepadText] = useState('🖳 Mini OS Session Log\n--------------------\n- Type anything here\n- This notepad runs entirely on React state.\n- Experiment with the desktop windows!');
  const [calcInput, setCalcInput] = useState('0');
  const [calcPrev, setCalcPrev] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  
  // Terminal console state
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Welcome to Tayyaba OS v1.0.4',
    'Type "help" to see available commands.',
    ''
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Dragging states
  const [dragInfo, setDragInfo] = useState<{ windowId: string; startX: number; startY: number; windowStartX: number; windowStartY: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Update System Time (simulated within Mini OS top bar)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Bring clicked window to top
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    });
  };

  const openWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: true, isMinimized: false } : w))
    );
    focusWindow(id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  const minimizeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  // Drag calculation
  const startDrag = (id: string, e: React.MouseEvent) => {
    focusWindow(id);
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    
    // Prevent dragging if clicking button
    const target = e.target as HTMLElement;
    if (target.closest('.window-control-btn')) return;

    setDragInfo({
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      windowStartX: win.x,
      windowStartY: win.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragInfo || !desktopRef.current) return;
      const dx = e.clientX - dragInfo.startX;
      const dy = e.clientY - dragInfo.startY;
      const desktopRect = desktopRef.current.getBoundingClientRect();
      
      const targetWin = windows.find((w) => w.id === dragInfo.windowId);
      if (!targetWin) return;

      const newX = Math.max(0, Math.min(dragInfo.windowStartX + dx, desktopRect.width - targetWin.width));
      const newY = Math.max(0, Math.min(dragInfo.windowStartY + dy, desktopRect.height - targetWin.height));

      setWindows((prev) =>
        prev.map((w) => (w.id === dragInfo.windowId ? { ...w, x: newX, y: newY } : w))
      );
    };

    const handleMouseUp = () => {
      if (dragInfo) {
        setDragInfo(null);
      }
    };

    if (dragInfo) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, windows]);

  // Working Calculator Logic
  const handleCalcClick = (val: string) => {
    if (/\d/.test(val)) {
      setCalcInput((prev) => (prev === '0' ? val : prev + val));
    } else if (val === '.') {
      setCalcInput((prev) => (prev.includes('.') ? prev : prev + '.'));
    } else if (val === 'C') {
      setCalcInput('0');
      setCalcPrev(null);
      setCalcOp(null);
    } else if (val === '=') {
      if (!calcOp || calcPrev === null) return;
      const current = parseFloat(calcInput);
      const prev = parseFloat(calcPrev);
      let result = 0;
      switch (calcOp) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = current !== 0 ? prev / current : 0; break;
      }
      setCalcInput(parseFloat(result.toFixed(5)).toString());
      setCalcPrev(null);
      setCalcOp(null);
    } else {
      // Operators: +, -, *, /
      setCalcPrev(calcInput);
      setCalcOp(val);
      setCalcInput('0');
    }
  };

  // Working Terminal Command Logic
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLines = [...terminalLines, `tayyaba-os$ ${terminalInput}`];

    if (cmd === 'help') {
      newLines.push(
        'Available commands:',
        '  whoami   - Quick introduction of Tayyaba Shaikh',
        '  projects - List of primary development projects',
        '  coffee   - Dispense computational fuel',
        '  clear    - Clear console output logs',
        '  exit     - Close this terminal window'
      );
    } else if (cmd === 'whoami') {
      newLines.push(
        'Name: Tayyaba Shaikh',
        'Location: Mumbai, India',
        'Role: Frontend Developer & Content Writer',
        'Status: Finalizing BSc in IT',
        'Mission: Building memorable digital products and writing storytelling copy.'
      );
    } else if (cmd === 'projects') {
      newLines.push('Primary Showcases:');
      PROJECTS.forEach((p) => {
        newLines.push(`  ${p.symbol}  ${p.title} - ${p.description.slice(0, 45)}...`);
      });
    } else if (cmd === 'coffee') {
      newLines.push(
        '☕ Computational error: Coffee cup underflow!',
        'Inserting 5 virtual espresso beans into core motherboard logs...',
        'Status: Energy level restored to 200%. Let us build!'
      );
    } else if (cmd === 'clear') {
      setTerminalLines([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'exit') {
      closeWindow('terminal');
      setTerminalInput('');
      return;
    } else {
      newLines.push(`command not found: "${cmd}". Type "help" for a list of shortcuts.`);
    }

    setTerminalLines(newLines);
    setTerminalInput('');

    // Scroll to bottom
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* Laptop Mockup Wrapper */}
      <div className="relative w-full max-w-2xl px-4 select-none">
        
        {/* Outer Laptop Lid / Screen frame */}
        <div className="relative bg-[#1a1b24] border-[12px] border-[#0c0d12] rounded-t-3xl shadow-2xl overflow-hidden aspect-[16/10] flex flex-col">
          
          {/* Webcam Element */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#050505] flex items-center justify-center border border-white/5 z-40">
            <div className="w-0.5 h-0.5 bg-blue-500/80 rounded-full" />
          </div>

          {/* Interactive Screen workspace */}
          <div 
            ref={desktopRef}
            className="relative w-full flex-1 bg-gradient-to-tr from-[#060814] via-[#0d102b] to-[#12081f] overflow-hidden flex flex-col"
          >
            {/* System Top Status Bar */}
            <div className="h-6 bg-[#060814]/85 border-b border-white/5 px-2.5 flex items-center justify-between text-[10px] font-mono text-white/50 z-30 select-none">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium cursor-pointer" onClick={() => setStartMenuOpen(!startMenuOpen)}>
                  ◉ tayyaba.sh
                </span>
                <span className="text-white/10">|</span>
                <button 
                  onClick={() => openWindow('terminal')} 
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-2.5 h-2.5" /> Shell
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 flex items-center gap-0.5 font-sans font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </span>
                <span className="text-white/20">|</span>
                <span>{systemTime}</span>
              </div>
            </div>

            {/* Desktop Icons Grid */}
            <div className="absolute inset-y-8 left-4 w-20 flex flex-col gap-4 z-10 pt-4">
              {/* Terminal Icon */}
              <button
                onClick={() => openWindow('terminal')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all duration-200">
                  <Terminal className="w-4.5 h-4.5" />
                </div>
                <span className="text-[9px] font-mono text-white/70 group-hover:text-white">Terminal</span>
              </button>

              {/* Notepad Icon */}
              <button
                onClick={() => openWindow('notepad')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-200 text-sm">
                  🖳
                </div>
                <span className="text-[9px] font-mono text-white/70 group-hover:text-white">Notepad</span>
              </button>

              {/* Calculator Icon */}
              <button
                onClick={() => openWindow('calculator')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-200 text-sm">
                  🖩
                </div>
                <span className="text-[9px] font-mono text-white/70 group-hover:text-white">Calc</span>
              </button>
            </div>

            {/* Render Draggable Desktop Windows */}
            {windows.map((win) => {
              if (!win.isOpen || win.isMinimized) return null;
              const isActive = activeWindowId === win.id;

              return (
                <div
                  key={win.id}
                  style={{
                    position: 'absolute',
                    left: `${win.x}px`,
                    top: `${win.y}px`,
                    width: `${win.width}px`,
                    height: `${win.height}px`,
                    zIndex: win.zIndex
                  }}
                  onMouseDown={() => focusWindow(win.id)}
                  className={`flex flex-col rounded-lg border overflow-hidden shadow-lg select-text text-white transition-all duration-75 ${
                    isActive
                      ? 'bg-[#0b0c16] border-[#22d3ee]/30 shadow-cyan-950/20'
                      : 'bg-[#07080f] border-white/5'
                  }`}
                >
                  {/* Window Bar (Draggable handle) */}
                  <div
                    onMouseDown={(e) => startDrag(win.id, e)}
                    className={`h-5 px-1.5 flex items-center justify-between text-[8px] font-mono cursor-move select-none border-b ${
                      isActive ? 'bg-white/5 border-[#22d3ee]/20 text-white' : 'bg-transparent border-white/5 text-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={isActive ? 'text-cyan-400' : 'text-white/30'}>
                        {win.id === 'terminal' ? '⌨' : win.id === 'calculator' ? '🖩' : '🖳'}
                      </span>
                      <span>{win.title}</span>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => minimizeWindow(win.id, e)}
                        className="window-control-btn w-3 h-3 hover:bg-white/10 rounded flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                      >
                        <Minimize2 className="w-1.5 h-1.5" />
                      </button>
                      <button
                        onClick={(e) => closeWindow(win.id, e)}
                        className="window-control-btn w-3 h-3 hover:bg-rose-500/20 hover:text-rose-400 rounded flex items-center justify-center text-white/50 cursor-pointer"
                      >
                        <X className="w-1.5 h-1.5" />
                      </button>
                    </div>
                  </div>

                  {/* Window Body Contents */}
                  <div className="flex-1 overflow-auto p-1.5 relative select-text">
                    
                    {/* TERMINAL CONTENT */}
                    {win.id === 'terminal' && (
                      <div className="h-full flex flex-col font-mono text-[9px] leading-relaxed text-cyan-300">
                        <div className="flex-1 overflow-y-auto pr-0.5 no-scrollbar">
                          {terminalLines.map((line, i) => (
                            <div key={i} className="whitespace-pre-wrap">{line}</div>
                          ))}
                          <div ref={terminalBottomRef} />
                        </div>
                        <form onSubmit={handleTerminalSubmit} className="flex items-center mt-1 border-t border-cyan-500/10 pt-1 text-cyan-400 shrink-0">
                          <span className="mr-1 select-none">tayyaba-os$</span>
                          <input
                            type="text"
                            value={terminalInput}
                            onChange={(e) => setCalcInput && setTerminalInput(e.target.value)}
                            className="flex-1 bg-transparent border-0 outline-none text-[9px] p-0 font-mono focus:ring-0 focus:outline-none"
                            autoFocus
                          />
                        </form>
                      </div>
                    )}

                    {/* NOTEPAD CONTENT */}
                    {win.id === 'notepad' && (
                      <textarea
                        value={notepadText}
                        onChange={(e) => setNotepadText(e.target.value)}
                        className="w-full h-full bg-transparent border-none resize-none outline-none focus:ring-0 font-mono text-[9px] text-amber-200 leading-normal p-0"
                      />
                    )}

                    {/* CALCULATOR CONTENT */}
                    {win.id === 'calculator' && (
                      <div className="h-full flex flex-col font-mono select-none">
                        {/* Output monitor */}
                        <div className="bg-black/30 rounded p-1 text-right text-xs text-purple-300 font-bold tracking-tight mb-1 truncate">
                          {calcInput}
                        </div>
                        {/* Interactive Keypad */}
                        <div className="grid grid-cols-4 gap-1 flex-1 text-[8px]">
                          {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.'].map((btn) => (
                            <button
                              key={btn}
                              onClick={() => handleCalcClick(btn)}
                              className={`rounded flex items-center justify-center font-bold border cursor-pointer active:scale-95 transition-transform ${
                                btn === '=' 
                                  ? 'bg-purple-600/30 border-purple-500/40 hover:bg-purple-500/40 text-white' 
                                  : btn === 'C'
                                  ? 'bg-rose-900/20 border-rose-800/30 text-rose-300 hover:bg-rose-900/30'
                                  : 'bg-white/[0.03] border-white/5 text-white/80 hover:bg-white/[0.08]'
                              }`}
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Start Menu Drawer */}
            {startMenuOpen && (
              <div className="absolute bottom-6 left-2.5 w-44 rounded-xl border border-white/10 glass-panel-deep p-2 z-40 shadow-2xl">
                <div className="border-b border-white/5 pb-2 mb-2">
                  <div className="text-[10px] text-white font-medium">Tayyaba Shaikh</div>
                  <div className="text-[8px] text-white/40 font-mono">BSc IT Candidate | India</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openWindow('terminal')}
                    className="flex items-center gap-2 px-1.5 py-1 rounded text-[9px] text-white/70 hover:bg-white/5 hover:text-white cursor-pointer text-left"
                  >
                    <Terminal className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Launch Shell</span>
                  </button>
                  <button
                    onClick={() => openWindow('notepad')}
                    className="flex items-center gap-2 px-1.5 py-1 rounded text-[9px] text-white/70 hover:bg-white/5 hover:text-white cursor-pointer text-left"
                  >
                    <span className="text-amber-400">🖳</span>
                    <span>Open Notes</span>
                  </button>
                  <button
                    onClick={() => openWindow('calculator')}
                    className="flex items-center gap-2 px-1.5 py-1 rounded text-[9px] text-white/70 hover:bg-white/5 hover:text-white cursor-pointer text-left"
                  >
                    <span className="text-purple-400">🖩</span>
                    <span>Open Calculator</span>
                  </button>
                </div>
                <div className="border-t border-white/5 mt-2 pt-2 flex items-center justify-between text-[7px] text-white/30 font-mono">
                  <span>OS v1.0.4</span>
                  <span>Press ESC to exit</span>
                </div>
              </div>
            )}

            {/* Desktop Start Bar at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-[#060814]/85 border-t border-white/5 px-2 flex items-center justify-between z-30 select-none">
              <button
                onClick={() => setStartMenuOpen(!startMenuOpen)}
                className="h-4 px-2 rounded bg-cyan-950/45 border border-cyan-800/30 text-[9px] font-mono text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>◉ Menu</span>
              </button>

              {/* Running Tasks indicator in lower bar */}
              <div className="flex items-center gap-1.5">
                {windows.map((win) => (
                  <button
                    key={win.id}
                    onClick={() => {
                      if (win.isOpen) {
                        if (win.isMinimized || activeWindowId !== win.id) {
                          focusWindow(win.id);
                        } else {
                          minimizeWindow(win.id);
                        }
                      } else {
                        openWindow(win.id);
                      }
                    }}
                    className={`h-4 px-1.5 rounded text-[8px] font-mono transition-all duration-200 cursor-pointer border flex items-center gap-1 ${
                      win.isOpen && !win.isMinimized
                        ? activeWindowId === win.id
                          ? 'bg-cyan-400/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-white/5 border-white/5 text-white/70'
                        : 'bg-transparent border-transparent text-white/20'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${win.isOpen ? 'bg-cyan-400' : 'bg-white/10'}`} />
                    <span>{win.title}</span>
                  </button>
                ))}
              </div>

              <div className="text-[7px] text-white/20 font-mono">
                HTML5 Desktop Engine
              </div>
            </div>

          </div>
        </div>

        {/* Laptop Keyboard Body & Base */}
        <div className="relative bg-[#0c0d12] h-4 rounded-b-xl border-t border-[#1f202a] shadow-xl flex items-center justify-center">
          {/* Bevel reflection highlight line */}
          <div className="absolute top-0 inset-x-6 h-0.5 bg-white/5" />
          
          {/* Display notch / finger recess */}
          <div className="absolute -top-1 w-14 h-1.5 bg-[#08080a] rounded-b-md mx-auto" />
          
          {/* Trackpad marker */}
          <div className="w-16 h-1.5 bg-[#171822] rounded-b-sm border-x border-b border-white/5 opacity-50" />
        </div>

        {/* Laptop base shadow pad */}
        <div className="w-[90%] h-2 bg-black/60 rounded-full blur-md mx-auto mt-0.5 opacity-80" />

      </div>

      {/* Decorative subtitle */}
      <div className="mt-4 text-center px-4 max-w-md">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase block mb-1">
          Interactive Mockup
        </span>
        <p className="text-xs font-sans text-white/50 leading-relaxed">
          This browser operating system was built as an experiment to recreate the feeling of using a desktop entirely with frontend technologies.
        </p>
      </div>
    </div>
  );
}
