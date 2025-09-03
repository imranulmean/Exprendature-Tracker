import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import QRCode from 'react-qr-code';
import { useState } from "react";

export default function QRcodeGenerator(){

    const [inputValue, setInputValue] = useState('');
    const [qrValue, setQrValue] = useState('');    

    const handleGenerateQrCode = () => {
        setQrValue(inputValue);
      };
    
    return(
        <>
          <Header />
          <Jumbotron />        
          <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter text or URL"
              />
              <button onClick={handleGenerateQrCode}>Generate QR Code</button>
              {qrValue && (
                <div style={{ marginTop: '20px' }}>
                  <QRCode value={qrValue} size={100} level="H" />
                </div>
              )}
        </>
    )
}