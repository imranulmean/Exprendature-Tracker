import { useEffect } from "react"
import { ALLAH_NAMES } from "./names";
import HeaderPublic from "./HeaderPublic";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Card } from 'flowbite-react';

export default function ReactSpeech(){

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    useEffect(()=>{        
        if (!browserSupportsSpeechRecognition) {
            return <span>Browser doesn't support speech recognition.</span>;
          }
    },[])


    const startListening = () => SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US'
      });

    return(
        <>
            <HeaderPublic/>
            React Speech Test
            <p>Microphone: {listening ? 'on' : 'off'}</p>

            <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={startListening}>
                Start
            </Button>            
            <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={SpeechRecognition.stopListening}>
                Stop
            </Button>            
            <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={resetTranscript}>
                Reset
            </Button>                        
            <p>{transcript}</p>            
        </>
    )
}