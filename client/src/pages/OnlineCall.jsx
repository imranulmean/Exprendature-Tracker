if (typeof global === 'undefined') {
    window.global = window;
  }
  
  import React, { useEffect, useRef, useState } from "react";
  import io from "socket.io-client";
  import Peer from "simple-peer/simplepeer.min.js";
  
  export default function OnlineCall() {
    const BASE_API = import.meta.env.VITE_API_BASE_URL;
   
    const socket = useRef();
  
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
  
    const [onlineUsers, setOnlineUsers] = useState([]);
  
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
  
    useEffect(() => {
      // Connect to Socket
      socket.current = io.connect('https://search-llm.onrender.com');
  
      // Get Camera
      navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
        })
        .catch((err) => alert("Camera blocked or not found: " + err));
  
      socket.current.on("me", (id) => setMe(id));
  
      socket.current.on("updateUserList", (users) => {
        // Filter out your own ID so you don't call yourself
        const others = users.filter(userId => userId !== socket.current.id);
        setOnlineUsers(others);
      });    
  
      socket.current.on("callUser", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });
  
      return () => socket.current.disconnect();
    }, [BASE_API]);
  
    const callUser = (id) => {
      alert("Button clicked. Stream status: " + (stream ? "Ready" : "Empty"));
      if (!stream) return alert("Please wait for camera to load");
  
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });
  
      peer.on("signal", (data) => {
        // This alert will now work!
        console.log("Generated Signal:", data);
        socket.current.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
        });
      });
  
      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });
  
      socket.current.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
  
      connectionRef.current = peer;
    };
  
    const answerCall = () => {
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });
  
      peer.on("signal", (data) => {
        socket.current.emit("answerCall", { signal: data, to: caller });
      });
  
      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });
  
      peer.signal(callerSignal);
      connectionRef.current = peer;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans">
          <h1 className="text-3xl font-black text-slate-800 mb-10 tracking-tight">AudioCall HD</h1>

            {/* Online Users List */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Active Directory</h3>
                <div className="space-y-2">
                    {onlineUsers.length > 0 ? onlineUsers.map((userId) => (
                    <div key={userId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {/* <span className="text-xs font-mono text-slate-500">{userId.substring(0, 12)}...</span> */}
                            <span className="text-xs font-mono text-slate-500">{userId}</span>
                        </div>
                        <button onClick={() => callUser(userId)}
                                className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                        >
                            CALL
                        </button>
                    </div>
                    )) : (
                    <p className="text-center text-slate-400 text-xs py-4">Waiting for others to log on...</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-10 mb-12">
            {/* My Profile */}
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-2 relative">
                    <span className="text-4xl">🎙️</span>
                    {
                        stream && 
                        <div className="absolute bottom-0 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    }
                </div>
                <p className="text-sm font-bold text-slate-500">You</p>
            </div>
        
            {/* Remote Profile */}
            <div className="flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-2 transition-all ${callAccepted ? 'bg-emerald-100 animate-pulse' : 'bg-gray-200'}`}>
                    <span className="text-4xl">{callAccepted ? '👨‍💼' : '👤'}</span>
                </div>
                <p className="text-sm font-bold text-slate-500">
                {callAccepted ? "Connected" : "Waiting..."}
                </p>                
                {/* HIDDEN AUDIO TAG - This is what plays the sound */}
                {
                    callAccepted && !callEnded && (
                    <audio ref={userVideo} autoPlay /> 
                )}
            </div>
            </div>
      
            {/* Controls (Same as before but styled for Audio) */}
            <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your ID</label>
                    <p className="font-mono text-indigo-600 font-bold bg-indigo-50 p-2 rounded-lg mt-1 break-all">{me}</p>
                </div>
                
                <input 
                    className="w-full bg-slate-100 p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="Paste Peer ID..."
                    value={idToCall}
                    onChange={(e) => setIdToCall(e.target.value)}
                />
                
                <button 
                    onClick={() => callUser(idToCall)}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                >
                    Start Audio Call
                </button>
            </div>
      
          {/* Incoming Call Overlay */}
          {receivingCall && !callAccepted && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white p-10 rounded-[40px] text-center shadow-2xl">
                    <div className="text-5xl mb-4 animate-bounce">📞</div>
                    <h2 className="text-2xl font-bold mb-8">Voice Call Incoming...</h2>
                    <div className="flex gap-4">
                        <button onClick={answerCall} className="bg-green-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-green-200">Answer</button>
                        <button onClick={() => setReceivingCall(false)} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-full font-bold">Ignore</button>
                    </div>
                </div>
            </div>
          )}
        </div>
      );    
    
    // return (
    //   <div className="min-h-screen bg-gray-100 p-5 font-sans text-gray-800">
    //     <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Video Connect</h1>
    
    //     <div className="flex flex-wrap justify-center gap-6">
    //       {/* Local Video Container */}
    //       <div className="bg-gray-900 p-3 rounded-xl shadow-2xl border-4 border-indigo-500/20">
    //         <p className="text-white text-sm font-medium mb-2 text-center">My Camera (Local)</p>
    //         <video 
    //           playsInline 
    //           muted 
    //           ref={myVideo} 
    //           autoPlay 
    //           className="w-[300px] h-[225px] rounded-lg bg-black scale-x-[-1] object-cover" 
    //         />
    //       </div>
    
    //       {/* Remote Video Container */}
    //       <div className="bg-gray-900 p-3 rounded-xl shadow-2xl border-4 border-emerald-500/20">
    //         <p className="text-white text-sm font-medium mb-2 text-center">Remote Camera</p>
    //         {callAccepted && !callEnded ? (
    //           <video 
    //             playsInline 
    //             ref={userVideo} 
    //             autoPlay 
    //             className="w-[300px] h-[225px] rounded-lg bg-black object-cover" 
    //           />
    //         ) : (
    //           <div className="w-[300px] h-[225px] flex items-center justify-center bg-gray-800 rounded-lg border border-dashed border-gray-600 text-gray-400 italic">
    //             Waiting for connection...
    //           </div>
    //         )}
    //       </div>
    //     </div>
    
    //     {/* User Controls & Online List */}
    //     <div className="max-w-2xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          
    //       {/* My Info & Direct Dial */}
    //       <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    //         <h3 className="text-lg font-semibold mb-4 border-b pb-2">My Information</h3>
    //         <p className="text-sm mb-4">
    //           Your ID: <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded select-all cursor-pointer" title="Click to copy">{me || "Connecting..."}</span>
    //         </p>
            
    //         <div className="flex flex-col gap-2">
    //           <input 
    //             placeholder="Enter ID manually" 
    //             value={idToCall} 
    //             onChange={(e) => setIdToCall(e.target.value)} 
    //             className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    //           />
    //           <button 
    //             onClick={() => callUser(idToCall)} 
    //             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg active:transform active:scale-95"
    //           >
    //             Call ID
    //           </button>
    //         </div>
    //       </div>
    
    //       {/* Online Users List */}
    //       <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    //         <h3 className="text-lg font-semibold mb-4 border-b pb-2">Active Users</h3>
    //         <div className="space-y-3 max-h-40 overflow-y-auto">
    //           {onlineUsers.length > 0 ? onlineUsers.map((userId) => (
    //             <div key={userId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
    //               <div className="flex items-center gap-2">
    //                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    //                 <span className="text-xs font-mono text-gray-600 truncate w-24">{userId}</span>
    //               </div>
    //               <button 
    //                 onClick={() => callUser(userId)}
    //                 className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold py-1 px-3 rounded-md transition-all"
    //               >
    //                 CALL
    //               </button>
    //             </div>
    //           )) : (
    //             <p className="text-xs text-gray-400 text-center py-4 italic">No other users online</p>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    
    //     {/* Incoming Call Popup */}
    //     {receivingCall && !callAccepted && (
    //       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    //         <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-indigo-500 animate-bounce-short text-center">
    //           <h2 className="text-2xl font-black text-indigo-900 mb-2">Incoming Call!</h2>
    //           <p className="text-gray-500 mb-6">User ID: {caller.substring(0, 8)}...</p>
    //           <div className="flex gap-4 justify-center">
    //             <button 
    //               onClick={answerCall} 
    //               className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
    //             >
    //               Answer
    //             </button>
    //             <button 
    //               onClick={() => setReceivingCall(false)} 
    //               className="bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold py-3 px-6 rounded-full transition-all"
    //             >
    //               Decline
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // );
  }