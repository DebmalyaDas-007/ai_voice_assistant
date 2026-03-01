import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  role: "user" | "ai";
  text: string;
}

function App() {
  const API_URL = "http://127.0.0.1:8000/chat";
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"idle" | "speaking" | "listening" | "thinking">("idle");
  const [started, setStarted] = useState(false);
  const cancelledRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (cancelledRef.current) return resolve();
      setStatus("speaking");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const listen = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (cancelledRef.current) return reject("cancelled");
      setStatus("listening");
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject("SpeechRecognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (err: any) => reject(err);
    });
  };

  const startAssistant = async () => {
    cancelledRef.current = false;

    while (!cancelledRef.current) {
      await speak("Ask your question sir");

      try {
        const userText = await listen();
        if (cancelledRef.current) break;

        setMessages((prev) => [...prev, { role: "user", text: userText }]);

        setStatus("thinking");
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText }),
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const answer = data.response;

        setMessages((prev) => [...prev, { role: "ai", text: answer }]);

        await speak(answer);
      } catch (err) {
        if (cancelledRef.current) break;
        console.error(err);
        await speak("Sorry, I could not understand. Please try again.");
      }

      if (cancelledRef.current) break;

      await speak("Do you want to ask more? Say yes or no.");
      try {
        const decision = await listen();
        if (decision.toLowerCase().includes("no")) {
          await speak("Goodbye sir");
          break;
        }
      } catch {
        await speak("Goodbye sir");
        break;
      }
    }

    setStatus("idle");
    setStarted(false);
    cancelledRef.current = false;
  };

  const handleStart = () => {
    setStarted(true);
    startAssistant();
  };

  const handleStop = () => {
    cancelledRef.current = true;
    speechSynthesis.cancel();
    setStatus("idle");
    setStarted(false);
  };

  const statusLabel = {
    idle: "",
    speaking: "🔊 Speaking...",
    listening: "🎙️ Listening...",
    thinking: "🤔 Thinking...",
  }[status];

  return (
    <div className="container">
      <div className="chat-box">
        <h1>Debmalya Voice AI 🤖</h1>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {statusLabel && <div className="status">{statusLabel}</div>}

        <div className="controls">
          {!started ? (
            <button className="btn start" onClick={handleStart}>
              🎤 Start
            </button>
          ) : (
            <button className="btn stop" onClick={handleStop}>
              ⏹ Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;