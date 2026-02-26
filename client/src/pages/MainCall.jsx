import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {
    StreamVideo, StreamCall, StreamVideoClient,
    StreamTheme, SpeakerLayout, CallControls
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

export default function MainCall(){

    const {callId}= useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const apiKey = import.meta.env.VITE_GETSTREAM_API_KEY;
    const navigate= useNavigate();

    useEffect(()=>{
        const userId=localStorage.getItem('userId') || "Guest";

        const initStream = async () => {
            // https://search-llm.onrender.com
            const res = await fetch('https://search-llm.onrender.com/get-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const { token } = await res.json();
            const _client = new StreamVideoClient({ apiKey, user: { id: userId }, token });
            const _call = _client.call('default', callId);
            await _call.getOrCreate();
            await _call.join();   
            setClient(_client);
            setCall(_call);         
        };
        initStream();   
        
        return () => {
            if(client){
                client.disconnectUser();
            }
            
        }        
        
    },[]);

    const endCall = async () => {
        console.log('end call clicked')
        navigate('/callstream')
        // try {
        //     if (call) {
        //         await call.leave();
        //         setCall(null);
        //     }
        //     if (client) {
        //         await client.disconnectUser();
        //     }            
        //     console.log("Redirecting to dashboard...");

        // } catch (error) {
        //     console.error("Error during hangup:", error);
        // }
    };

    if (!client) return <div className="p-10 text-center">Initializing...</div>;

    return(
        <>
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <StreamTheme>
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl border">
                            <SpeakerLayout />
                            <div className="mt-8 flex justify-center">
                                <CallControls onLeave={endCall} />
                            </div>
                        </div>
                    </StreamTheme>
                </StreamCall>
            </StreamVideo>        
        </>
    )
}