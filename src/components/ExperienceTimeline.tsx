import { useState } from 'react';
import { Calendar, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { EXPERIENCES, ACCENTS } from '../data';

interface ExperienceTimelineProps {
  accentColor: string;
}

export default function ExperienceTimeline({ accentColor }: ExperienceTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>('exp-inamigos'); // default expand first item
  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto font-sans pl-6 md:pl-8 py-4">
      {/* Vertical linking timeline conduit */}
      <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-0.5 bg-white/5" />

      <div className="space-y-6">
        {EXPERIENCES.map((exp) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div key={exp.id} className="relative select-none">
              
              {/* Timeline Indicator node */}
              <div 
                onClick={() => handleToggle(exp.id)}
                className="absolute -left-[24px] md:-left-[28px] top-4 w-4 h-4 rounded-full border-2 bg-[#020206] cursor-pointer transition-colors duration-300 flex items-center justify-center group"
                style={{ 
                  borderColor: isExpanded ? activeAccent.hex : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full transition-transform duration-300 scale-0 group-hover:scale-100"
                  style={{ 
                    backgroundColor: activeAccent.hex,
                    transform: isExpanded ? 'scale(1)' : 'scale(0)'
                  }}
                />
              </div>

              {/* Experience glass panel card */}
              <div 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isExpanded 
                    ? 'glass-panel border-white/15 shadow-lg' 
                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                }`}
                onClick={() => handleToggle(exp.id)}
              >
                {/* Header Summary */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                        {exp.company}
                      </h4>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/55">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 font-medium mt-1">
                      {exp.role}
                    </div>
                  </div>

                  <div className="shrink-0 text-white/30">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Collapsible details body with responsive padding */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 bg-black/10 text-xs text-white/70 leading-relaxed font-sans select-text">
                    <p className="mb-2.5">{exp.description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400" style={{ color: activeAccent.hex }}>
                      <span className="w-1 h-1 rounded-full bg-cyan-400" style={{ backgroundColor: activeAccent.hex }} />
                      <span>Remote Writing Internship</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
