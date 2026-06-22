import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=<>?";

export default function ScrambleText({ text }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      const scrambled = text.split("").map((char) => {
        if (char === " ") return " ";
        // Scramble ~15% of the characters every frame to create a glitch effect
        if (Math.random() < 0.15) {
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        return char;
      }).join("");
      setDisplay(scrambled);
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
}
