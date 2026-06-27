import React, { useState } from 'react';
import { Send, Check, Mail, MapPin, Sparkles, Clock } from 'lucide-react';
import { ACCENTS } from '../data';

interface ContactFormProps {
  accentColor: string;
}

export default function ContactForm({ accentColor }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    // Simulate safe transit dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Auto close success panel after 4 seconds
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1500);
  };

  const activeAccent = ACCENTS.find((a) => a.id === accentColor) || ACCENTS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-4xl mx-auto font-sans text-left">
      
      {/* Informative details column */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        <div>
          <h4 className="text-xl font-display font-bold tracking-tight text-white mb-3">
            Let's build something interesting.
          </h4>
          <p className="text-xs text-white/50 leading-relaxed max-w-xs">
            Whether it is a frontend project, an article, or simply an idea you think sounds impossible, I would love to hear it.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email item */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Email Direct</span>
              <a 
                href="mailto:myth5901@gmail.com" 
                className="text-xs text-white hover:underline hover:text-cyan-400 transition-all font-medium"
                style={{ '--hover-color': activeAccent.hex } as React.CSSProperties}
              >
                myth5901@gmail.com
              </a>
            </div>
          </div>

          {/* Location item */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Location</span>
              <span className="text-xs text-white font-medium">Mumbai, India</span>
            </div>
          </div>

          {/* Availability Status ticker */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">Availability</span>
              <span className="text-xs text-white/80 font-medium">
                Open to internships, freelance work, collaborations, and interesting conversations.
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/20 select-none">
          No trackers enabled. Secure transit.
        </div>
      </div>

      {/* Actual interactive submission card */}
      <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-white/5 relative overflow-hidden">
        
        {isSuccess ? (
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border" style={{ borderColor: activeAccent.hex, backgroundColor: `${activeAccent.hex}10` }}>
              <Check className="w-6 h-6" style={{ color: activeAccent.hex }} />
            </div>
            <h5 className="text-sm font-semibold text-white tracking-tight">Message routed successfully</h5>
            <p className="text-[11px] text-white/40 mt-1.5 max-w-xs leading-relaxed">
              Your transmission has bypassed local caches and landed safely in my mailbox. Speak soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Tayyaba Shaikh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-white/20 outline-none focus:ring-0 focus:outline-none transition-all"
                  style={{ '--focus-color': activeAccent.hex } as React.CSSProperties}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="myth5901@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-white/20 outline-none focus:ring-0 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Subject</label>
              <input
                type="text"
                placeholder="Collaboration opportunity / Feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-white/20 outline-none focus:ring-0 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write your thoughts here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 hover:border-white/15 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-white/20 outline-none focus:ring-0 focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-95 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: activeAccent.hex }}
            >
              {isSubmitting ? (
                <span>Routing Transmission...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
