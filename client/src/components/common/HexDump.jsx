import { useState, useEffect } from "react";

const generateHexLine = () => {
  const prefix = `0x${Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0").toUpperCase()} `;
  let hexStr = "";
  for (let i = 0; i < 4; i++) {
    hexStr += Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase() + " ";
  }
  return prefix + hexStr.trim();
};

const generateBinaryLine = () => {
  let binStr = "";
  for (let i = 0; i < 30; i++) {
    binStr += Math.random() > 0.5 ? "1" : "0";
    if (Math.random() > 0.8) binStr += " ";
  }
  return binStr;
};

const generateBlock = (lines, type) => {
  return Array.from({ length: lines }, type === "hex" ? generateHexLine : generateBinaryLine);
};

export default function HexDump({ side, type = "hex" }) {
  // Generate a large block of lines, duplicate it for seamless scrolling
  const [hexLines, setHexLines] = useState(() => {
    const lines = generateBlock(120, type);
    return [...lines, ...lines];
  });

  useEffect(() => {
    const lines = generateBlock(120, type);
    setHexLines([...lines, ...lines]);

    // Lightning fast mutation for binary, slow mutation for hex
    const intervalTime = type === "binary" ? 50 : 500;
    const linesToMutate = type === "binary" ? 15 : 2;

    const interval = setInterval(() => {
      setHexLines((prev) => {
        const next = [...prev];
        for (let i = 0; i < linesToMutate; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = type === "hex" ? generateHexLine() : generateBinaryLine();
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className={`hex-dump hex-dump-${side} ${type === "binary" ? "binary-lightning" : ""}`} aria-hidden="true">
      <div className="hex-lines-container">
        {hexLines.map((line, i) => (
          <div key={i} className="hex-line" style={{ opacity: type === "binary" ? Math.random() * 0.5 + 0.5 : 1 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
