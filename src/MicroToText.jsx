// import { useRef, useState } from "react";
// const DEEPGRAM_API_KEY = "63b3a6ef4b281847e846ac98eabf8ec3d019b71d";

// export default function MicToText() {
//   const [text, setText] = useState("");
//   const [listening, setListening] = useState(false);

//   const socketRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const processorRef = useRef(null);

//   const startRecording = async () => {
//     if (listening) return;

//     setText(""); 
//     setListening(true);

//     try {
//       // 1️⃣ Get microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       // 2️⃣ Setup WebSocket to Deepgram
//       const socket = new WebSocket(
//         "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&language=en",
//         ["token", DEEPGRAM_API_KEY]
//       );

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         const transcript = data.channel?.alternatives?.[0]?.transcript;
//         if (transcript) {
//           setText((prev) => prev + " " + transcript);
//         }
//       };

//       socket.onerror = (err) => console.error("WebSocket error:", err);
//       socket.onclose = () => console.log("WebSocket closed");

//       socketRef.current = socket;

//       // 3️⃣ Setup AudioContext and processor
//       const audioContext = new AudioContext({ sampleRate: 16000 });
//       const source = audioContext.createMediaStreamSource(stream);
//       const processor = audioContext.createScriptProcessor(4096, 1, 1);

//       processor.onaudioprocess = (e) => {
//         if (socket.readyState === WebSocket.OPEN) {
//           const input = e.inputBuffer.getChannelData(0);
//           const pcm = convertFloat32ToInt16(input);
//           socket.send(pcm);
//         }
//       };

//       source.connect(processor);
//       processor.connect(audioContext.destination);

//       audioContextRef.current = audioContext;
//       processorRef.current = processor;

//       console.log("Recording started");
//     } catch (err) {
//       console.error("Microphone access error:", err);
//       setListening(false);
//     }
//   };

//   const stopRecording = () => {
//     if (!listening) return;

//     socketRef.current?.close();
//     processorRef.current?.disconnect();
//     audioContextRef.current?.close();

//     setListening(false);
//     console.log("Recording stopped");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🎙️ Live Speech to Text</h2>
//       <button onClick={startRecording} disabled={listening} style={{ marginRight: 10 }}>
//         Start Recording
//       </button>
//       <button onClick={stopRecording} disabled={!listening}>
//         Stop Recording
//       </button>

//       <p style={{ marginTop: 20 }}>
//         <strong>Transcript:</strong>
//       </p>
//       <div
//         style={{
//           minHeight: 100,
//           padding: 10,
//           border: "1px solid #ccc",
//           borderRadius: 5,
//           background: "#f9f9f9"
//         }}
//       >
//         {text || "Waiting for speech..."}
//       </div>
//     </div>
//   );
// }

// // 🔧 Helper: Convert Float32 array to 16-bit PCM
// function convertFloat32ToInt16(buffer) {
//   const l = buffer.length;
//   const result = new Int16Array(l);
//   for (let i = 0; i < l; i++) {
//     const s = Math.max(-1, Math.min(1, buffer[i]));
//     result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
//   }
//   return result.buffer;
// }
