import { useEffect, useState, useRef } from 'react';

export default function AuroraBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized offset from center (-0.5 to 0.5)
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute transform values for subtle parallax on different layers
  const layer1Style = {
    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1)`,
  };

  const layer2Style = {
    transform: `translate(${mousePosition.x * -35}px, ${mousePosition.y * -35}px) scale(1.05)`,
  };

  const layer3Style = {
    transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * -15}px) scale(0.95)`,
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 bg-[#03030d] overflow-hidden select-none pointer-events-none"
    >
      {/* Background Ambient Base Noise/Color */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(6,8,24,0.8)_0%,rgba(2,2,6,1)_100%] opacity-90" />

      {/* Aurora Layer 1 - Deep Cyan / Navy */}
      <div 
        style={layer1Style}
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-cyan-950/20 blur-[120px] mix-blend-screen animate-aurora-1 transition-transform duration-700 ease-out"
      />

      {/* Aurora Layer 2 - Indigo / Purple */}
      <div 
        style={layer2Style}
        className="absolute top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-purple-950/15 blur-[140px] mix-blend-screen animate-aurora-2 transition-transform duration-700 ease-out"
      />

      {/* Aurora Layer 3 - Subtle Pink Highlight */}
      <div 
        style={layer3Style}
        className="absolute -bottom-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-rose-950/10 blur-[130px] mix-blend-screen animate-aurora-3 transition-transform duration-700 ease-out"
      />

      {/* Subtle Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
