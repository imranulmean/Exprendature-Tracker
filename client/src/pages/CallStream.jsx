import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import { useNavigate } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";


export default function OnlineCall() {
    const socket = useRef();
    const [me, setMe] = useState("");
    const [myId, setMyId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState({});

    const [receivingCall, setReceivingCall] = useState(false);
    const [incomingData, setIncomingData] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const navigate= useNavigate();

    const ringtone = useRef(new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3"));

    useEffect(() => {
        const userId = "User_" + Math.floor(Math.random() * 1000);
        localStorage.setItem('userId',userId);
        setMyId(userId)
        // 1. Setup Socket
        socket.current = io('https://search-llm.onrender.com', { auth: { username: userId } });

        socket.current.on("me", (id) => setMe(id));
        socket.current.on("updateUserList", (users) => setOnlineUsers(users));

        socket.current.on("callUser", (data) => {
            setIncomingData(data);
            setReceivingCall(true);
            ringtone.current.play().catch(() => {});
        });

        socket.current.on("callAccepted", () => {
            setIsCalling(false); // Stop showing "Calling..." overlay
        });
        
        return () => {
            socket.current.disconnect();
        }
    }, []);

    const startCall = async (targetSocketId) => {
        const callId = `call_${me}_${Date.now()}`;        
        socket.current.emit("callUser", {
            userToCall: targetSocketId,            
            from: me,
            fromUserId:myId,
            callId: callId
        });
        navigate(`/maincall/${callId}`);
    };

    const answerCall = async () => {
        ringtone.current.pause();        
        socket.current.emit("answerCall", { to: incomingData.from });
        setReceivingCall(false);
        navigate(`/maincall/${incomingData.callId}`);

    };

    return (
        <>
            <HeaderPublic/>
            <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
                <h1 className="text-3xl font-black mb-10">AudioCall HD</h1>
                <h1 className="text-xl font-black mb-10">My Id: {myId}</h1>
                {
                    Object.entries(onlineUsers).length > 0 ? (
                        <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Online Now</h3>
                            <div className="space-y-2">
                                {Object.entries(onlineUsers).map(([sId, uId]) => sId !== me && (
                                    <div key={sId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-mono">{uId}</span>
                                        <button onClick={() => startCall(sId)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">CALL</button>
                                    </div>
                                ))}
                            </div>
                        </div>                    
                    ):(<p>Getting Other Users</p>)
                }

    
                {/* Incoming Call UI */}
                {receivingCall && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50">
                        <div className="bg-white p-10 rounded-[40px] text-center">
                            <div className="text-5xl mb-4 animate-bounce">📞</div>
                            <h2 className="text-2xl font-bold mb-8">Incoming Audio... From {incomingData.fromUserId}</h2>
                            <div className="flex gap-4">
                                <button onClick={answerCall} className="bg-green-500 text-white px-10 py-4 rounded-full font-bold">Answer</button>
                                <button onClick={() => {setReceivingCall(false); ringtone.current.pause();}} className="bg-slate-200 px-10 py-4 rounded-full font-bold">Ignore</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>            
        </>

    );
}

