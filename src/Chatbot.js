import React, { useState } from "react";

export default function Chatbot() {

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [listening, setListening] = useState(false);

  /* ===== SPEECH TO TEXT ===== */
  const startVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = e => {
      setMessage(e.results[0][0].transcript);
      setListening(false);
    };
  };

  /* ===== TEXT TO SPEECH ===== */
  const speak = text => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  /* ===== SEND MESSAGE ===== */
  const send = async () => {
    const res = await fetch("http://localhost:8080/ai/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    const data = await res.json();
    setReply(data.reply);
    setSessionId(data.sessionId);
    speak(data.reply);
  };

  return (
    <div className="card">

      <h2>🤖 AI Health Assistant</h2>

      <textarea
        rows="4"
        value={message}
        placeholder="Describe your symptoms..."
        onChange={e => setMessage(e.target.value)}
      />

      <br />

      <button onClick={startVoice}>
        {listening ? "🎤 Listening..." : "🎙️ Speak"}
      </button>

      <button onClick={send}>Ask AI</button>

      {reply && (
        <pre style={{ marginTop: "15px", whiteSpace: "pre-wrap" }}>
          {reply}
        </pre>
      )}

      <p style={{ fontSize: "12px", marginTop: "10px" }}>
        ⚠️ AI assistance only — not a medical diagnosis.
      </p>

    </div>
  );
}
