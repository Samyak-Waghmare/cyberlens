import { useRef, useState, useEffect } from "react";
import { EXAMPLES, MIN_CHARS } from "../../constants/examples.js";
import { useOcr } from "../../hooks/useOcr.js";
import { calculateFileHash } from "../../utils/hash.js";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition.js";
import ScrambleText from "../common/ScrambleText.jsx";

const TABS = [
  { id: "text", label: "Text / Message" },
  { id: "url", label: "URL" },
  { id: "email", label: "Email" },
  { id: "image", label: "Image (OCR)" },
  { id: "file", label: "File (Malware)" },
  { id: "voice", label: "Voice (Call)" },
];

export default function AnalyzerInput({ onAnalyze, disabled, onToast }) {
  const [activeTab, setActiveTab] = useState("text");
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const { ocrStatus, progress, extractText } = useOcr();
  const { isRecording, startRecording, stopRecording, supported } = useVoiceRecognition(setValue);

  const trimmed = value.trim();
  const tooShort = activeTab !== "image" && trimmed.length < MIN_CHARS;
  const showError = touched && tooShort && value.length > 0;
  const busy = disabled || ocrStatus === "loading";

  // Change placeholder based on active tab
  const getPlaceholder = () => {
    switch (activeTab) {
      case "url": return "https://suspicious-domain.com/login...";
      case "email": return "Paste the suspicious email headers or body here...";
      case "image": return "Drag & drop a screenshot of a text message or email, or click 'Scan image'...";
      case "file": return "Drag & drop any file to compute its hash and scan for malware without uploading it...";
      case "voice": return "Click 'START RECORDING' to transcribe a live scam call or voicemail...";
      default: return "Paste a suspicious message, SMS text, or social media post...";
    }
  };

  const submit = () => {
    setTouched(true);
    if (activeTab === "image" && !trimmed) {
      onToast?.("Please scan an image first or enter text", "error");
      return;
    }
    if (tooShort) return;
    onAnalyze(trimmed);
  };

  const handleImage = async (file) => {
    if (!file) return;
    setActiveTab("image");
    onToast?.("Reading text from image…", "info");
    const { text, error } = await extractText(file);
    if (error) {
      onToast?.(error, "error");
      return;
    }
    setValue(text);
    onToast?.("Text extracted from screenshot", "success");
  };

  const handleFileScan = async (file) => {
    if (!file) return;
    setActiveTab("file");
    onToast?.("Computing SHA-256 hash...", "info");
    try {
      const hash = await calculateFileHash(file);
      onToast?.("Hash computed, sending to VirusTotal", "success");
      onAnalyze(`[File Scan: ${file.name}]\nHash: ${hash}`, hash);
    } catch (err) {
      onToast?.("Failed to hash file.", "error");
    }
  };

  const onFilePick = (e) => {
    const file = e.target.files?.[0];
    if (activeTab === "file") {
      handleFileScan(file);
    } else {
      handleImage(file);
    }
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (activeTab === "file" || !file.type.startsWith("image/")) {
      handleFileScan(file);
    } else {
      handleImage(file);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue(text);
    } catch {
      /* clipboard read blocked — ignore */
    }
  };

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
  };

  return (
    <section className="analyzer card" id="scanner">
      {/* Explicit Tabs */}
      <div className="analyzer-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`analyzer-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="analyzer-header">
        <label className="analyzer-label" htmlFor="analyzer-input">
          INPUT SOURCE: {activeTab.toUpperCase()}
        </label>
      </div>

      <div
        className={`textarea-wrap ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <textarea
          id="analyzer-input"
          className="analyzer-textarea"
          placeholder={getPlaceholder()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={onKeyDown}
          disabled={busy}
          spellCheck="false"
        />

        {ocrStatus === "loading" && (
          <div className="ocr-overlay">
            <ScrambleText text="[OCR] DECRYPTING IMAGE PATTERNS..." />
            <p style={{ marginTop: "0.5rem" }}>{progress > 0 ? `${progress}%` : ""}</p>
          </div>
        )}

        {isRecording && (
          <div className="ocr-overlay">
            <div style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="pulsing-dot" style={{ width: "12px", height: "12px", background: "var(--danger)", borderRadius: "50%", animation: "pulse 1s infinite" }}></span>
              LISTENING... 
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Speak clearly into the microphone. Press STOP when done.</p>
          </div>
        )}

        <div className="textarea-tools">
          {activeTab === "voice" && supported && (
            <button
              type="button"
              className="tool-btn"
              onClick={isRecording ? stopRecording : startRecording}
              style={{ color: isRecording ? "var(--danger)" : "var(--accent)" }}
            >
              {isRecording ? "[STOP RECORDING]" : "[START RECORDING]"}
            </button>
          )}
          {activeTab !== "voice" && (
            <button
              type="button"
              className="tool-btn"
              onClick={() => {
                if (activeTab !== "file") setActiveTab("image");
                fileRef.current?.click();
              }}
              disabled={busy}
              title={activeTab === "file" ? "Scan a file hash" : "Scan a screenshot (OCR)"}
            >
              {activeTab === "file" ? "[SELECT FILE]" : "[SCAN IMAGE]"}
            </button>
          )}
          <button
            type="button"
            className="tool-btn"
            onClick={pasteFromClipboard}
            disabled={busy}
            title="Paste from clipboard"
          >
            [PASTE]
          </button>
          {value && (
            <button
              type="button"
              className="tool-btn"
              onClick={() => setValue("")}
              disabled={busy}
              title="Clear"
            >
              [CLEAR]
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept={activeTab === "file" ? "*/*" : "image/*"}
          hidden
          onChange={onFilePick}
        />
      </div>

      <div className="analyzer-meta">
        <div className="example-buttons">
          <span className="try-label">TEST_DATA:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              className="example-btn"
              onClick={() => {
                setValue(ex.value);
                // Auto-switch tab based on content roughly
                if (ex.value.startsWith("http")) setActiveTab("url");
                else if (ex.label.toLowerCase().includes("email")) setActiveTab("email");
                else setActiveTab("text");
              }}
              disabled={busy}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <span className={`char-counter ${tooShort ? "muted" : ""}`}>
          BYTES: {value.length}
        </span>
      </div>

      {showError && (
        <p className="input-error">ERROR: Please enter at least {MIN_CHARS} characters.</p>
      )}

      <button type="button" className="analyze-btn" onClick={submit} disabled={busy}>
        {disabled ? (
          <>
            <ScrambleText text="[SYS] INITIATING NEURAL SCAN..." />
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            RUN ANALYSIS
          </>
        )}
      </button>
      <p className="kbd-hint">
        CMD: <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute
      </p>
    </section>
  );
}
