import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    // Attach listeners to detect hover on interactive tags
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive-hover') ||
        target.closest('.interactive-hover');

      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      {/* Outer Ring Follower */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-50 mix-blend-screen hidden md:block"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${hovered ? 1.6 : 1})`,
          backgroundColor: hovered ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
          borderColor: hovered ? 'rgba(34, 211, 238, 0.7)' : 'rgba(34, 211, 238, 0.3)',
          boxShadow: hovered ? '0 0 16px rgba(34, 211, 238, 0.3)' : 'none'
        }}
      />
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 hidden md:block"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </>
  );
}
