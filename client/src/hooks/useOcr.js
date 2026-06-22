import { useCallback, useRef, useState } from "react";

/**
 * On-device OCR for scam screenshots (SMS / WhatsApp / email images).
 * Tesseract.js is lazy-loaded only when the user actually uploads an image,
 * so it never weighs down the initial page.
 */
export function useOcr() {
  const [ocrStatus, setOcrStatus] = useState("idle"); // idle | loading | error
  const [progress, setProgress] = useState(0);
  const workerRef = useRef(null);

  const extractText = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setOcrStatus("error");
      return { error: "Please choose an image file." };
    }
    setOcrStatus("loading");
    setProgress(0);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (msg) => {
          if (msg.status === "recognizing text") {
            setProgress(Math.round(msg.progress * 100));
          }
        },
      });
      workerRef.current = worker;

      const { data } = await worker.recognize(file);
      await worker.terminate();
      workerRef.current = null;

      const text = (data.text || "").trim();
      setOcrStatus("idle");
      setProgress(0);
      if (!text) return { error: "No readable text found in that image." };
      return { text };
    } catch (err) {
      setOcrStatus("error");
      try {
        await workerRef.current?.terminate();
      } catch {
        /* ignore */
      }
      return { error: err.message || "Could not read the image." };
    }
  }, []);

  return { ocrStatus, progress, extractText };
}
