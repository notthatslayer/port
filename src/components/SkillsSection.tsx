import React from 'react';
import { Sparkles, Terminal, Palette, PenTool, Layout, Layers, HelpCircle } from 'lucide-react';
import { ACCENTS } from '../data';

interface SkillsSectionProps {
  accentColor: string;
}

export default function SkillsSection({ accentColor }: SkillsSectionProps) {
  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  const frontendSkills = [
    { name: 'HTML', desc: 'Semantic layouts' },
    { name: 'CSS', desc: 'Fluid & responsive design' },
    { name: 'JavaScript', desc: 'Asynchronous event loops' },
    { name: 'Python', desc: 'Data automation scripts' },
    { name: 'MySQL', desc: 'Relational data queries' },
  ];

  const creativeSkills = [
    { name: 'Content Writing', desc: 'Storytelling copy' },
    { name: 'SEO Optimization', desc: 'Audience discoverability' },
    { name: 'Blog Writing', desc: 'In-depth researched articles' },
    { name: 'Copywriting', desc: 'Consistent brand voices' },
    { name: 'Product Thinking', desc: 'User-first interface logic' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto font-sans">
      
      {/* Front-End Modules Card */}
      <div className="rounded-2xl glass-panel p-6 border-white/5 relative overflow-hidden group hover:border-white/15 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-5">
          <Terminal className="w-5 h-5" style={{ color: activeAccent.hex }} />
          <h4 className="text-base font-display font-bold text-white tracking-tight">
            Frontend & Engineering
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {frontendSkills.map((sk) => (
            <div
              key={sk.name}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-300 group/pill"
            >
              <div className="text-xs font-semibold text-white group-hover/pill:text-cyan-400 transition-colors" style={{
                '--hover-color': activeAccent.hex
              } as React.CSSProperties}>
                {sk.name}
              </div>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                {sk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Writing & Brand Modules Card */}
      <div className="rounded-2xl glass-panel p-6 border-white/5 relative overflow-hidden group hover:border-white/15 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-5">
          <PenTool className="w-5 h-5" style={{ color: activeAccent.hex }} />
          <h4 className="text-base font-display font-bold text-white tracking-tight">
            Creative, Copy & Product
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {creativeSkills.map((sk) => (
            <div
              key={sk.name}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-300 group/pill"
            >
              <div className="text-xs font-semibold text-white group-hover/pill:text-cyan-400 transition-colors">
                {sk.name}
              </div>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                {sk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
