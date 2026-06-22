import { useState, useEffect } from "react";

export default function InteractiveGrid() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Base static grid */}
      <div className="bg-grid base-grid" aria-hidden="true" />
      {/* Interactive glow grid masked by radial gradient based on mouse position */}
      <div 
        className="bg-grid interactive-grid" 
        aria-hidden="true" 
        style={{
          background: "var(--bg-grid-interactive)",
          WebkitMaskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 10%, transparent 80%)`,
          maskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 10%, transparent 80%)`
        }}
      />
    </>
  );
}
