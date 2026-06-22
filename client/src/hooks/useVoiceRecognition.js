import { useState, useEffect, useCallback } from "react";

export function useVoiceRecognition(onResult) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = "en-US";

        reco.onresult = (event) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (onResult) onResult(transcript);
        };

        reco.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        reco.onend = () => {
          setIsRecording(false);
        };

        setRecognition(reco);
      }
    }
  }, [onResult]);

  const startRecording = useCallback(() => {
    if (recognition && !isRecording) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  }, [recognition, isRecording]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording]);

  return { isRecording, startRecording, stopRecording, supported: !!recognition };
}
