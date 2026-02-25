import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks
  } from '@stream-io/video-react-sdk';
  
  import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState } from 'react';
  import '../index.css';
  
  export default function CallStream() {

    const apiKey = 'jkcwe5uw5yj5';

    const userId = 'Sneaky_Mosquito';
    const callId = 'Ui0hPbiq4HsDnpP0P1won';  
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);    

    useEffect(() => {
        const initCall = async () => {
            try {
                // 1. Fetch the token from your Node.js backend
                const response = await fetch('http://localhost:3001/get-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                const { token } = await response.json();

                // 2. Initialize the client
                const user = {
                    id: userId,
                    name: 'Oliver',
                    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
                };
                
                const _client = new StreamVideoClient({ apiKey, user, token });
                const _call = _client.call('default', callId);
                
                // 3. Join the call
                await _call.join({ create: true });
                setClient(_client);
                setCall(_call);                

            } catch (error) {
                console.error("Failed to initialize call:", error);
            }
        };

        initCall();

        return () => {
            if (client) client.disconnectUser();
        };
    }, []);    

    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MyUILayout />
        </StreamCall>
      </StreamVideo>
    );
  }
  
  export const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
  
    if (callingState !== CallingState.JOINED) {
      return <div>Loading...</div>;
    }
  
    return (
      <StreamTheme>
        <SpeakerLayout participantsBarPosition='bottom' />
        <CallControls />
      </StreamTheme>
    );
  };