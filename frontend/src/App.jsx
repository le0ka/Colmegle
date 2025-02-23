import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peer = useRef(null);

  useEffect(() => {
    // Initialize PeerJS with local server
    peer.current = new Peer(uuidv4().slice(0, 6), {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    peer.current.on("open", (id) => {
      console.log("My Peer ID:", id);
      setPeerId(id);
    });

    peer.current.on("call", (call) => {
      console.log("Incoming call from:", call.peer);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("Answering call with stream:", stream);
          localStream.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            console.log("Receiving remote stream:", remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => console.error("Failed to get media for answering call", err));
    });

    return () => {
      peer.current.destroy();
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("Local stream:", stream);
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  const callPeer = () => {
    console.log("Trying to call Peer ID:", remotePeerId);
    if (!remotePeerId) {
      alert("Enter a valid Peer ID to call!");
      return;
    }
    const call = peer.current.call(remotePeerId, localStream.current);
    call.on("stream", (remoteStream) => {
      console.log("Receiving remote stream:", remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Colmegle Video Chat</h1>
      <p>Your Peer ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{peerId}</span></p>

      <div className="flex space-x-4 mt-4">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black border-2 border-white rounded-lg"></video>
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black border-2 border-white rounded-lg"></video>
      </div>

      <button onClick={startVideo} className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">
        Start Video
      </button>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Peer ID to call"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="px-4 py-2 text-black rounded-lg"
        />
        <button onClick={callPeer} className="ml-2 px-4 py-2 bg-green-500 rounded-lg">
          Call
        </button>
      </div>
    </div>
  );
};

export default App;
