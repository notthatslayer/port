import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS, ARTICLES, CERTIFICATE_FOLDERS, ACCENTS } from './data';
import { FloatingWindow } from './types';

// Component Imports
import AuroraBackground from './components/AuroraBackground';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import MiniOSPreview from './components/MiniOSPreview';
import FloatingWindowManager from './components/FloatingWindowManager';
import StartupAnimation from './components/StartupAnimation';
import SkillsSection from './components/SkillsSection';
import ExperienceTimeline from './components/ExperienceTimeline';
import ContactForm from './components/ContactForm';

// Icon Imports
import { 
  Github, 
  Linkedin, 
  BookOpen, 
  ExternalLink, 
  ArrowUp, 
  Search, 
  Monitor, 
  FileText, 
  Folder, 
  Sparkles, 
  Terminal, 
  MapPin, 
  Laptop, 
  Compass, 
  AlertCircle,
  X,
  Palette,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [showStartup, setShowStartup] = useState(true);
  const [accentColor, setAccentColor] = useState('cyan');
  const [activeSection, setActiveSection] = useState('home');
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  
  // Floating Windows State Manager
  const [windows, setWindows] = useState<FloatingWindow[]>([]);
  
  // Easter eggs & Interactive Modals State
  const [greetingToast, setGreetingToast] = useState(false);
  const [creditsModal, setCreditsModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Buffer state to track global keyboard typings
  const [keyBuffer, setKeyBuffer] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Active Accent Hex and Styles
  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  // Track Konami code and typed letters
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // 1. Capture alphanumeric and arrow keys
      const key = e.key.toLowerCase();
      setKeyBuffer((prev) => {
        const next = [...prev, key].slice(-15); // retain last 15 keys
        const typedStr = next.join('');

        // Detect "hello"
        if (typedStr.endsWith('hello')) {
          setGreetingToast(true);
          setTimeout(() => setGreetingToast(false), 5000);
        }

        // Detect Konami: ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a
        const konamiSequence = [
          'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
          'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
          'b', 'a'
        ];
        const isKonami = next.slice(-10).every((val, idx) => val === konamiSequence[idx]);
        if (isKonami) {
          setDeveloperMode(true);
        }

        return next;
      });
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Update Scroll Active Section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'skills', 'experience', 'writing', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating Window Management
  const openProjectWindow = (projectId: string) => {
    const proj = PROJECTS.find((p) => p.id === projectId);
    if (!proj) return;

    setWindows((prev) => {
      // If already open, focus it
      const existing = prev.find((w) => w.id === `proj-${projectId}`);
      if (existing) {
        const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
        return prev.map((w) => 
          w.id === `proj-${projectId}` ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
        );
      }

      // Add new floating window
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      const isMobile = window.innerWidth < 768;
      return [
        ...prev,
        {
          id: `proj-${projectId}`,
          title: `Showcase: ${proj.title}`,
          type: 'project',
          contentId: projectId,
          isOpen: true,
          isMinimized: false,
          x: isMobile ? 16 : Math.max(80, window.innerWidth / 2 - 300),
          y: isMobile ? 80 : 120,
          width: isMobile ? window.innerWidth - 32 : 600,
          height: isMobile ? 480 : 450,
          zIndex: maxZ + 1
        }
      ];
    });
  };

  const openArticleWindow = (articleId: string) => {
    const art = ARTICLES.find((a) => a.id === articleId);
    if (!art) return;

    setWindows((prev) => {
      const existing = prev.find((w) => w.id === `art-${articleId}`);
      if (existing) {
        const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
        return prev.map((w) => 
          w.id === `art-${articleId}` ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
        );
      }

      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      const isMobile = window.innerWidth < 768;
      return [
        ...prev,
        {
          id: `art-${articleId}`,
          title: `Reading: ${art.title}`,
          type: 'article',
          contentId: articleId,
          isOpen: true,
          isMinimized: false,
          x: isMobile ? 16 : Math.max(100, window.innerWidth / 2 - 280),
          y: isMobile ? 80 : 100,
          width: isMobile ? window.innerWidth - 32 : 560,
          height: isMobile ? 480 : 480,
          zIndex: maxZ + 1
        }
      ];
    });
  };

  const openCertificateFolderWindow = (folderId: string) => {
    const folder = CERTIFICATE_FOLDERS.find((f) => f.id === folderId);
    if (!folder) return;

    setWindows((prev) => {
      const existing = prev.find((w) => w.id === `folder-${folderId}`);
      if (existing) {
        const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
        return prev.map((w) => 
          w.id === `folder-${folderId}` ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
        );
      }

      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      const isMobile = window.innerWidth < 768;
      return [
        ...prev,
        {
          id: `folder-${folderId}`,
          title: `Archive: ${folder.name}`,
          type: 'certificate',
          contentId: folderId,
          isOpen: true,
          isMinimized: false,
          x: isMobile ? 16 : Math.max(120, window.innerWidth / 2 - 260),
          y: isMobile ? 80 : 140,
          width: isMobile ? window.innerWidth - 32 : 520,
          height: isMobile ? 450 : 400,
          zIndex: maxZ + 1
        }
      ];
    });
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  };

  const handleFocusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    });
  };

  const handleUpdateWindowPosition = (id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showStartup) {
    return <StartupAnimation onComplete={() => setShowStartup(false)} />;
  }

  return (
    <div className="min-h-screen text-white selection:bg-cyan-500/20 selection:text-white flex flex-col font-sans relative pb-20 no-scrollbar">
      
      {/* Visual background and custom follow-dot cursor */}
      <AuroraBackground />
      <CustomCursor />

      {/* EASTER EGG 1: Hello Toast */}
      {greetingToast && (
        <div className="fixed bottom-24 left-6 z-50 rounded-xl border border-white/10 glass-panel-deep p-4 shadow-2xl animate-bounce flex items-center gap-3 max-w-sm">
          <div className="text-xl">◡̈</div>
          <div className="text-xs font-mono text-cyan-300">
            <strong>Hello Visitor!</strong> You typed "hello" globally. Unlocking secret greeting token.
          </div>
        </div>
      )}

      {/* EASTER EGG 2: Developer Overclocked Banner */}
      {developerMode && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-[#22d3ee]/20 bg-black/85 backdrop-blur-md p-4 text-center max-w-md shadow-2xl border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              ⚡ Overclock Developer Mode Active
            </span>
            <button onClick={() => setDeveloperMode(false)} className="text-white/40 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] font-mono text-white/60 leading-relaxed text-left">
            Konami code verified. Ambient graphic frame rate and visual rendering parameters have been dynamically scaled.
          </p>
        </div>
      )}

      {/* EASTER EGG 3: Logo Double Click Credits */}
      {creditsModal && (
        <div className="fixed inset-0 z-50 bg-[#000]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl glass-panel-deep p-6 border-white/10 shadow-2xl text-center">
            <div className="text-2xl mb-2.5">⚝</div>
            <h5 className="text-sm font-semibold text-white tracking-tight">Handcrafted with Pride</h5>
            <p className="text-[11px] text-white/50 leading-relaxed mt-2">
              Built entirely by Tayyaba Shaikh. Developed in Mumbai, India using TypeScript, React 19, and Tailwind CSS.
            </p>
            <button
              onClick={() => setCreditsModal(false)}
              className="mt-5 px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-black transition-all cursor-pointer"
              style={{ backgroundColor: activeAccent.hex }}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Global Command Palette (Ctrl + K) overlay */}
      <CommandPalette
        onOpenProject={openProjectWindow}
        onOpenArticle={openArticleWindow}
        onOpenCertificateFolder={openCertificateFolderWindow}
        onNavigate={scrollToSection}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        screenshotMode={screenshotMode}
        setScreenshotMode={setScreenshotMode}
      />

      {/* Layer for active draggable overlapping window system */}
      <FloatingWindowManager
        windows={windows}
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={handleMinimizeWindow}
        onFocusWindow={handleFocusWindow}
        onUpdateWindowPosition={handleUpdateWindowPosition}
        accentColor={accentColor}
      />

      {/* STICKY GLASS HEADER NAVIGATION */}
      {!screenshotMode && (
        <header className="sticky top-0 left-0 right-0 z-40 bg-[#03030d]/40 backdrop-blur-md border-b border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            
            {/* Logo */}
            <div 
              onDoubleClick={() => setCreditsModal(true)}
              className="text-sm font-display font-bold tracking-tight text-white cursor-pointer hover:opacity-85 select-none"
            >
              Tayyaba<span style={{ color: activeAccent.hex }}>Shaikh.</span>
            </div>

            {/* Nav list */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-white/60">
              {['Home', 'Projects', 'Skills', 'Experience', 'Writing', 'Certificates', 'Contact'].map((sec) => {
                const secId = sec.toLowerCase();
                const isActive = activeSection === secId;

                return (
                  <button
                    key={sec}
                    onClick={() => scrollToSection(secId)}
                    className={`transition-all duration-300 relative cursor-pointer ${
                      isActive ? 'text-white font-semibold' : 'hover:text-white/80'
                    }`}
                  >
                    <span>{sec}</span>
                    {isActive && (
                      <span 
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: activeAccent.hex }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions (Theme selector button & Shortcuts) */}
            <div className="flex items-center gap-3">
              {/* Desktop keyboard helper indicator */}
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
                title="Keyboard Shortcuts"
              >
                ?
              </button>
              
              {/* Accent Indicator / Picker */}
              <div className="flex gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-full">
                {ACCENTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccentColor(acc.id)}
                    className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${
                      accentColor === acc.id ? 'scale-110 opacity-100 ring-1 ring-white/30' : 'opacity-40 hover:opacity-75'
                    }`}
                    style={{ backgroundColor: acc.hex }}
                  />
                ))}
              </div>
            </div>

          </div>
        </header>
      )}

      {/* KEYBOARD SHORTCUTS DRAWER */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl glass-panel-deep p-6 border-white/10 shadow-2xl relative text-left font-mono">
            <button
              onClick={() => setShowShortcuts(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
              Keyboard Navigation Guides
            </h5>
            <div className="space-y-3.5 text-xs text-white/70">
              <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                <span>Open search command palette</span>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Ctrl K</kbd>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                <span>Unlock Developer Console</span>
                <span className="text-[10px] text-white/40">Konami Code</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                <span>View credits trigger</span>
                <span className="text-[10px] text-white/40">Dbl Click Logo</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                <span>Type greetings anywhere</span>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">"hello"</kbd>
              </div>
            </div>
            <div className="mt-5 text-[10px] text-white/35 text-center leading-relaxed">
              Use standard desktop browsers for an optimal interactive layout.
            </div>
          </div>
        </div>
      )}

      {/* MAIN WEBSITE SECTIONS */}
      <main className="flex-1 max-w-4xl mx-auto px-6 w-full mt-8 md:mt-12 space-y-24 md:space-y-36">
        
        {/* HERO SECTION */}
        <section id="home" className="pt-8 md:pt-16 flex flex-col items-center text-center">
          
          {/* Subtle Accent ambient lighting badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono tracking-wider text-white/70 uppercase mb-6 select-none shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeAccent.hex }} />
            <span>Digital Product Portfolio</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            I build interfaces people enjoy using and write things people actually finish reading.
          </h2>

          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-lg mt-5 font-sans">
            Hi, I am Tayyaba Shaikh. I enjoy building polished frontend experiences, experimenting with creative web projects, and writing thoughtful copy.
          </p>

          {/* Quick Details Chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-6 font-mono text-[10px]">
            <span className="bg-white/[0.02] border border-white/5 text-white/70 px-3 py-1 rounded-full flex items-center gap-1.5">
              🖳 Frontend Developer
            </span>
            <span className="bg-white/[0.02] border border-white/5 text-white/70 px-3 py-1 rounded-full flex items-center gap-1.5">
              ♫ Content Writer
            </span>
            <span className="bg-white/[0.02] border border-white/5 text-white/70 px-3 py-1 rounded-full flex items-center gap-1.5">
              ⚝ BSc IT Student
            </span>
            <span className="bg-white/[0.02] border border-white/5 text-white/70 px-3 py-1 rounded-full flex items-center gap-1.5">
              ◉ Mumbai, India
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3.5 mt-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] duration-300"
              style={{ backgroundColor: activeAccent.hex }}
            >
              <span>View Projects</span>
            </button>
            <button
              onClick={() => scrollToSection('writing')}
              className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 text-white flex items-center gap-2 cursor-pointer bg-white/[0.02] transition-all hover:bg-white/[0.05] duration-300"
            >
              <span>Read My Writing</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 text-white/60 hover:text-white flex items-center gap-2 cursor-pointer bg-white/[0.01] transition-all duration-300"
            >
              <span>Contact Me</span>
            </button>
          </div>

        </section>

        {/* ABOUT / BENTO CARDS SECTION */}
        <section id="about" className="space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Methodology
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Behind the craft.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mx-auto">
            {/* Bento Card 1 */}
            <div className="rounded-2xl glass-panel p-6 border-white/5 relative overflow-hidden group hover:border-white/15 transition-all duration-300 select-text">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs mb-4 text-cyan-400" style={{ color: activeAccent.hex }}>
                🖳
              </div>
              <h5 className="text-sm font-semibold text-white tracking-tight mb-2">Code & Mechanics</h5>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                I approach frontend engineering with an emphasis on performance and clean layout state management. I believe that digital assets are only as good as they are satisfying to interact with.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl glass-panel p-6 border-white/5 relative overflow-hidden group hover:border-white/15 transition-all duration-300 select-text">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs mb-4 text-cyan-400" style={{ color: activeAccent.hex }}>
                ⚝
              </div>
              <h5 className="text-sm font-semibold text-white tracking-tight mb-2">Storytelling & Copy</h5>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Writing is another side of design. Combining content creation and tech literacy allows me to author articles that are highly readable, clear, structured, and informative.
              </p>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION (MINI OS CENTERPIECE + PROJECTS Showcase) */}
        <section id="projects" className="space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Centerpiece Project
            </span>
            <h3 className="text-2xl font-display font-bold text-white leading-tight">
              Mini OS Workspace.
            </h3>
            <p className="text-xs text-white/50 max-w-md mx-auto mt-2 leading-relaxed">
              Explore my primary showcase by interacting with the laptop mockup below. Double-click any desktop shortcut or run shell scripts!
            </p>
          </div>

          {/* Interactive laptop centerpiece */}
          <MiniOSPreview />

          {/* Secondary Showcases list */}
          <div className="space-y-6 pt-6">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
                Portfolio Showcases
              </span>
              <h4 className="text-xl font-display font-bold text-white">
                Other Experiments.
              </h4>
              <p className="text-xs text-white/50 max-w-md mx-auto mt-1 leading-relaxed">
                Click any experiment card to open its dedicated sandbox details window directly inside your browser!
              </p>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {PROJECTS.filter(p => p.id !== 'mini-os').map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => openProjectWindow(proj.id)}
                  className="rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/15 p-5 cursor-pointer text-left transition-all duration-300 group shadow-md"
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-2xl select-none">{proj.symbol}</span>
                    <span className="text-[9px] font-mono border border-white/10 px-2 py-0.5 rounded-full text-white/40 uppercase tracking-wider group-hover:border-cyan-400/20 group-hover:text-cyan-400 transition-colors" style={{
                      borderColor: activeSection === 'projects' ? `${activeAccent.hex}20` : undefined,
                      color: activeSection === 'projects' ? activeAccent.hex : undefined
                    }}>
                      {proj.mockType}
                    </span>
                  </div>

                  <h5 className="text-sm font-semibold text-white tracking-tight group-hover:text-cyan-400 transition-colors" style={{
                    '--hover-color': activeAccent.hex
                  } as React.CSSProperties}>
                    {proj.title}
                  </h5>

                  <p className="text-[11px] text-white/50 leading-relaxed mt-2 line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 mt-4 opacity-75 group-hover:opacity-100 transition-opacity" style={{ color: activeAccent.hex }}>
                    <span>Launch Sandbox</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Capacities
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Technical Modules.
            </h3>
          </div>

          <SkillsSection accentColor={accentColor} />
        </section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <section id="experience" className="space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Pathways
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Work History.
            </h3>
          </div>

          <ExperienceTimeline accentColor={accentColor} />
        </section>

        {/* WRITING SECTION (Premium Online Magazine) */}
        <section id="writing" className="space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Publications
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Technical Writings.
            </h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-2 leading-relaxed">
              Premium written articles on technology architecture, society, and product workflows. Click to read.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARTICLES.map((art) => (
              <div
                key={art.id}
                onClick={() => openArticleWindow(art.id)}
                className="rounded-2xl border border-white/5 hover:border-white/12 bg-white/[0.01] hover:bg-white/[0.025] overflow-hidden cursor-pointer flex flex-col text-left transition-all duration-300 group"
              >
                {/* Cover placeholder */}
                <div className="aspect-[16/9] bg-zinc-950/40 relative select-none overflow-hidden shrink-0">
                  <img
                    src={art.coverUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/65">
                    {art.readTime}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400" style={{ color: activeAccent.hex }}>
                      {art.topics[0]}
                    </span>
                    <h5 className="text-xs font-semibold text-white tracking-tight leading-tight mt-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {art.title}
                    </h5>
                    <p className="text-[10px] text-white/45 leading-relaxed mt-2 line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  <div className="text-[9px] font-mono text-white/30 mt-4">
                    {art.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATES DIGITAL ARCHIVE */}
        <section id="certificates" className="space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Credentials
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Digital Certificate Folders.
            </h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-2 leading-relaxed">
              Explore certificates and recommendation logs. Click folders to reveal document archives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {CERTIFICATE_FOLDERS.map((folder) => (
              <div
                key={folder.id}
                onClick={() => openCertificateFolderWindow(folder.id)}
                className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/12 rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center relative select-none"
              >
                {/* Folder icon symbol representation */}
                <div className="w-11 h-11 rounded-xl bg-[#c2a15c]/10 text-[#d4af37] border border-[#d4af37]/15 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                  <Folder className="w-5 h-5 fill-current" />
                </div>

                <h5 className="text-xs font-semibold text-white tracking-tight">
                  {folder.name}
                </h5>

                <span className="text-[9px] font-mono text-white/40 mt-1">
                  {folder.certificates.length} items logged
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CONNECTING LINKS AND SOCIAL CARDS */}
        <section id="links" className="space-y-6 max-w-xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Github */}
            <a
              href="https://github.com/notthatslayer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Github className="w-4 h-4 text-white/40 group-hover:text-white shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white truncate">GitHub</div>
                  <div className="text-[9px] font-mono text-white/30 truncate">notthatslayer</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/tayyaba590"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Linkedin className="w-4 h-4 text-white/40 group-hover:text-[#0a66c2] shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white truncate">LinkedIn</div>
                  <div className="text-[9px] font-mono text-white/30 truncate">tayyaba590</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Dev.to */}
            <a
              href="https://dev.to/deffslayer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 text-white/40 group-hover:text-white shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white truncate">Dev.to</div>
                  <div className="text-[9px] font-mono text-white/30 truncate">deffslayer</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Portfolio link */}
            <a
              href="https://notthatslayer.github.io/portfolioo/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Compass className="w-4 h-4 text-white/40 group-hover:text-cyan-400 shrink-0" style={{ color: activeSection === 'links' ? activeAccent.hex : undefined }} />
                <div>
                  <div className="text-xs font-semibold text-white truncate">Alt Port</div>
                  <div className="text-[9px] font-mono text-white/30 truncate">Tayyaba Legacy</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="space-y-8 pt-6 border-t border-white/[0.03]">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
              Communication
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Get in touch.
            </h3>
          </div>

          <ContactForm accentColor={accentColor} />
        </section>

      </main>

      {/* FOOTER COOPERATIVES */}
      {!screenshotMode && (
        <footer className="mt-16 md:mt-24 border-t border-white/5 py-8 text-center text-[10px] font-mono text-white/30 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6">
            <div>
              <span>Tayyaba Shaikh Portfolio • Mumbai, India</span>
            </div>
            <div className="flex items-center gap-4 text-[9px]">
              <button 
                onClick={() => setScreenshotMode(true)}
                className="hover:text-white hover:underline cursor-pointer"
                title="Screenshot Mode (Hides header, command palette buttons)"
              >
                [Screenshot Mode]
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white cursor-pointer flex items-center gap-0.5"
              >
                <ArrowUp className="w-3 h-3" /> Back to Top
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Screenshot Mode overlay button to restore UI */}
      {screenshotMode && (
        <button
          onClick={() => setScreenshotMode(false)}
          className="fixed bottom-6 left-6 z-50 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[10px] font-bold px-4 py-2.5 rounded-full cursor-pointer shadow-lg animate-pulse"
        >
          Exit Screenshot Mode
        </button>
      )}

    </div>
  );
}
