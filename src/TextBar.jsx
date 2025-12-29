import React, { useState, useRef } from "react";
import "./App.css";
import MicroPhone from "./MicroPhone";
const DEEPGRAM_API_KEY ="63b3a6ef4b281847e846ac98eabf8ec3d019b71d";
export default function TextBar() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const transcriptBuffer = useRef("");

  const startListening = async () => {
    if (listening) return;
    setListening(true);
    setText("");
    transcriptBuffer.current = "";
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const socket = new WebSocket(
      "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&language=en",
      ["token", DEEPGRAM_API_KEY]
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const t = data.channel?.alternatives?.[0]?.transcript;
      if (t) transcriptBuffer.current += " " + t;
    };

    socketRef.current = socket;
    const audioContext = new AudioContext({ sampleRate: 16000 });
    await audioContext.audioWorklet.addModule("/pcm-processor.js");

    const source = audioContext.createMediaStreamSource(stream);
   const worklet = new AudioWorkletNode(audioContext, "pcm-processor", {
  processorOptions: { frameSize: 128 } 
});

    worklet.port.onmessage = (e) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(e.data);
      }
    };

    source.connect(worklet);
    audioContextRef.current = audioContext;
    const uiTimer = setInterval(() => {
      setText(transcriptBuffer.current);
    }, 300);

    socket.onclose = () => clearInterval(uiTimer);
  };

  const stopListening = () => {
    socketRef.current?.close();
    audioContextRef.current?.close();
    setListening(false);
  };

  return (
    <div className="TextGen">
      <button onClick={startListening} disabled={listening}>
        Start
      </button>
      <button onClick={stopListening} disabled={!listening}>
        Stop
      </button>
      <p>{text || "Speak something..."}</p>
    </div>
  );
}
