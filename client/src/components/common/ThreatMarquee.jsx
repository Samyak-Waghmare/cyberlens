import { useEffect, useState } from "react";

const STREAMS = [
  "[BLOCKED IP: 192.168.4.11]",
  "[NODE SECURE]",
  "[PHISHING DETECTED: 0x8F2A...]",
  "[MALWARE PAYLOAD NEUTRALIZED]",
  "[SSL CERTIFICATE VALIDATED]",
  "[TRAFFIC ENCRYPTED]",
  "[UNAUTHORIZED ACCESS PREVENTED]",
  "[SYSTEM OPTIMAL]"
];

export default function ThreatMarquee() {
  const [stream, setStream] = useState("");

  useEffect(() => {
    let output = "";
    for (let i = 0; i < 30; i++) {
      output += STREAMS[Math.floor(Math.random() * STREAMS.length)] + " // ";
    }
    setStream(output);
  }, []);

  return (
    <div className="threat-marquee">
      <div className="marquee-content">{stream}{stream}</div>
    </div>
  );
}
