import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ChatRoom() {
    const socket = useRef();
    const [messages, setMessages] = useState([]);
    const [typedMsg, setTypedMsg] = useState("");
    const [roomUsers, setRoomUsers] = useState({});
    const scrollRef = useRef();

    const myId = localStorage.getItem('userId') || "Guest_" + Math.floor(Math.random() * 1000);
    const BASE_API = 'https://search-llm.onrender.com';

    useEffect(() => {
        socket.current = io(BASE_API, {
            auth: { username: myId }
        });

        socket.current.emit("join_public");

        socket.current.on("receive_group_msg", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.current.on("update_room_users", (users) => {
            setRoomUsers(users);
        });

        return () => socket.current.disconnect();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!typedMsg.trim()) return;

        socket.current.emit("send_group_msg", {
            username: myId,
            text: typedMsg
        });
        setTypedMsg("");
    };

    return (
        <div className="flex h-screen bg-gray-100 p-4 gap-4 font-sans">
            
            {/* Main Chat Area */}
            <div className="flex flex-col flex-[3] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex gap-2 justify-center items-center">
                    <h2 className="font-bold text-gray-700">Public Lounge</h2>
                    <h2 className="sm:hidden font-bold text-gray-700">Users: {Object.keys(roomUsers).length}</h2>
                    <Dropdown arrowIcon={true} label="Items"
                                class='rounded-md text-sm font-medium border mt-2'
                    >
                        <Dropdown.Item>
                            <Link to="/callstream">Call</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link to="/chat">Chat</Link>
                        </Dropdown.Item>            
                        <Dropdown.Item>
                            <Link to="/startPractice">Practice</Link>
                        </Dropdown.Item>            
                    </Dropdown>                    
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.username === myId ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                                m.username === myId 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}>
                                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">
                                    {m.username === myId ? "You" : m.username}
                                </p>
                                <p className="text-sm leading-relaxed">{m.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                    <input 
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={typedMsg}
                        onChange={(e) => setTypedMsg(e.target.value)}
                        placeholder="Say something to the room..."
                    />
                    <button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition-colors active:scale-95"
                    >
                        Send
                    </button>
                </form>
            </div>

            {/* Sidebar: Active Users */}
            <div className="hidden md:flex flex-col flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4 overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Online 
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {Object.keys(roomUsers).length}
                    </span>
                </h3>
                <ul className="space-y-3">
                    {Object.entries(roomUsers).map(([socketId, name]) => (
                        <li key={socketId} className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="">{name}</span>
                            {socketId === socket.current?.id && (
                                <span className="text-[10px] font-bold text-gray-900 italic">(Me)</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}