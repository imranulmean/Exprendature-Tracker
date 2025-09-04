import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from "react";

export default function QrReader(){

    const videoRef = useRef(null);
    const [scannedResult, setScannedResult] = useState('');
    const scannerRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            scannerRef.current = new QrScanner(
                videoRef.current,
                result => setScannedResult(result.data),
                {
                    highlightScanRegion: true,
                    // Add other options as needed
                }
            );
            scannerRef.current.start().catch((err)=>{
                console.error("Camera start failed:", err);
                setScannedResult(`⚠️ ${err}`);
            });
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop();
                scannerRef.current.destroy();
            }
        };
    }, []);

    return (
       <>
            <Header />
            <Jumbotron />        
            <div>
                <video ref={videoRef} style={{ width: '150px', border:"1px solid" }}> </video>
                {scannedResult && <p>Scanned Result: {scannedResult}</p>}
            </div>       
       </> 
    );
}