import React, { useEffect, useState, useRef } from 'react';
import { Search, Monitor, Terminal, FileText, Compass, Palette, Sparkles, HelpCircle, EyeOff } from 'lucide-react';
import { PROJECTS, ARTICLES, CERTIFICATE_FOLDERS, ACCENTS } from '../data';

interface CommandPaletteProps {
  onOpenProject: (id: string) => void;
  onOpenArticle: (id: string) => void;
  onOpenCertificateFolder: (id: string) => void;
  onNavigate: (sectionId: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  screenshotMode: boolean;
  setScreenshotMode: (enabled: boolean) => void;
}

export default function CommandPalette({
  onOpenProject,
  onOpenArticle,
  onOpenCertificateFolder,
  onNavigate,
  accentColor,
  setAccentColor,
  screenshotMode,
  setScreenshotMode,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Toggle open with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Build standard commands list
  const commands = [
    // Navigation
    { id: 'nav-home', title: 'Navigate: Home', category: 'Navigation', icon: Compass, action: () => onNavigate('home') },
    { id: 'nav-projects', title: 'Navigate: Projects & OS', category: 'Navigation', icon: Compass, action: () => onNavigate('projects') },
    { id: 'nav-experience', title: 'Navigate: Timeline', category: 'Navigation', icon: Compass, action: () => onNavigate('experience') },
    { id: 'nav-writing', title: 'Navigate: Writing', category: 'Navigation', icon: Compass, action: () => onNavigate('writing') },
    { id: 'nav-certificates', title: 'Navigate: Certificates', category: 'Navigation', icon: Compass, action: () => onNavigate('certificates') },
    { id: 'nav-contact', title: 'Navigate: Contact Me', category: 'Navigation', icon: Compass, action: () => onNavigate('contact') },

    // Theme Selector Actions
    ...ACCENTS.map((acc) => ({
      id: `theme-${acc.id}`,
      title: `Set Theme Accent: ${acc.name}`,
      category: 'Appearance',
      icon: Palette,
      action: () => setAccentColor(acc.id),
    })),

    // Utilities
    {
      id: 'toggle-screenshot',
      title: screenshotMode ? 'Disable Screenshot Mode (Show UI)' : 'Enable Screenshot Mode (Hide UI Clutter)',
      category: 'Utilities',
      icon: EyeOff,
      action: () => setScreenshotMode(!screenshotMode),
    },
  ];

  // Projects as commands
  const projectCommands = PROJECTS.map((proj) => ({
    id: `proj-${proj.id}`,
    title: `Project: Open ${proj.title}`,
    category: 'Projects',
    icon: Monitor,
    action: () => onOpenProject(proj.id),
  }));

  // Articles as commands
  const articleCommands = ARTICLES.map((art) => ({
    id: `art-${art.id}`,
    title: `Article: Read "${art.title}"`,
    category: 'Writing',
    icon: FileText,
    action: () => onOpenArticle(art.id),
  }));

  // Certificate folders as commands
  const certCommands = CERTIFICATE_FOLDERS.map((folder) => ({
    id: `cert-${folder.id}`,
    title: `Folder: Open "${folder.name}"`,
    category: 'Certificates',
    icon: Sparkles,
    action: () => onOpenCertificateFolder(folder.id),
  }));

  // All queryable items
  const allItems = [...commands, ...projectCommands, ...articleCommands, ...certCommands];

  // Filter items based on search input
  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside the palette list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  return (
    <>
      {/* Keyboard Shortcut Indicator Button in bottom right */}
      {!screenshotMode && (
        <button
          id="cmd-palette-launcher"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 glass-panel-deep hover:bg-white/5 text-white/50 hover:text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-mono tracking-tight cursor-pointer transition-all duration-300 group border-white/5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-white/15">
            Ctrl K
          </kbd>
        </button>
      )}

      {/* Actual Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4">
          <div
            ref={paletteRef}
            className="w-full max-w-lg rounded-2xl glass-panel-deep shadow-2xl border-white/10 overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Header Search Field */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything... (e.g. 'Projects', 'Mini OS', 'Theme', 'Writing')"
                className="w-full bg-transparent border-0 text-sm text-white placeholder-white/30 outline-none focus:ring-0 font-sans"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono bg-white/5 hover:bg-white/10 text-white/40 hover:text-white px-1.5 py-0.5 rounded transition-colors"
              >
                ESC
              </button>
            </div>

            {/* List Results */}
            <div className="max-h-[350px] overflow-y-auto p-2 no-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs font-mono text-white/30">
                  No matches found for "{search}"
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof filteredItems>)
                ).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    {/* Category Label */}
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/35">
                      {category}
                    </div>

                    {/* Category Items */}
                    {items.map((item) => {
                      const absoluteIndex = filteredItems.findIndex((x) => x.id === item.id);
                      const isSelected = absoluteIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            item.action();
                            setIsOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                            isSelected
                              ? 'bg-white/10 text-white'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isSelected ? 'scale-110 text-cyan-400' : 'text-white/40'
                              }`}
                              style={{ color: isSelected ? activeAccent.hex : undefined }}
                            />
                            <span className="text-xs font-sans font-medium">{item.title}</span>
                          </div>
                          {isSelected && (
                            <span
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded opacity-75"
                              style={{
                                color: activeAccent.hex,
                                backgroundColor: `${activeAccent.hex}15`,
                              }}
                            >
                              ENTER
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer with keyboard layout details */}
            <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="bg-white/5 px-1 rounded">↑↓</span> Move
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white/5 px-1 rounded">Enter</span> Select
                </span>
              </div>
              <div>
                <span>Press <span className="text-white/50 font-semibold">Ctrl K</span> to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
