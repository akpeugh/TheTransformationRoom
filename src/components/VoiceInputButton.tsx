import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = "",
  label = "Talk to Text",
  iconOnly = false,
  size = "sm"
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.");
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage("Listening... Speak now");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim());
          setStatusMessage("Transcribed!");
          setTimeout(() => {
            if (isListening) setStatusMessage("Listening...");
            else setStatusMessage(null);
          }, 1500);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setStatusMessage("Microphone permission denied. Allow mic access in your browser.");
        } else if (event.error === "no-speech") {
          setStatusMessage("No speech detected.");
        } else {
          setStatusMessage(`Speech note: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setStatusMessage(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setStatusMessage("Failed to start microphone.");
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setStatusMessage(null);
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-2 text-xs",
    lg: "px-4 py-2.5 text-sm"
  }[size];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Stop voice recording" : "Click to speak with talk-to-text"}
        className={`group inline-flex items-center gap-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs ${sizeClasses} ${
          isListening
            ? "bg-rose-600 text-white animate-pulse ring-2 ring-rose-400"
            : "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 hover:border-teal-300"
        } ${className}`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <MicOff className="w-3.5 h-3.5" />
            {!iconOnly && <span>Listening... Stop</span>}
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
            {!iconOnly && <span>{label}</span>}
          </>
        )}
      </button>

      {statusMessage && (
        <div className="absolute bottom-full mb-1 left-0 z-50 whitespace-nowrap bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 pointer-events-none flex items-center gap-1.5 animate-in fade-in">
          {isListening && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
