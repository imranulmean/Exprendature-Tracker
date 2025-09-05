import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import QRCode from 'react-qr-code';
import { useState } from "react";
import { Card, TextInput, Button } from "flowbite-react";

export default function QRcodeGenerator(){

    const [inputValue, setInputValue] = useState('');
    const [qrValue, setQrValue] = useState('');    
    const [count, setCount]= useState(20);
    const [qrList, setQrList] = useState([]);

    const handleGenerateQrCode = () => {
        setQrValue(inputValue);
      };

    const handleGenerateBatch = () => {
      if (!inputValue) return;
      const newList = Array.from({ length: count }, (_,i) => ({
        id: i,
        value: inputValue,
      }));
      setQrList(newList);
    };      

    const handlePrint = () => {
      window.print();
    };    
    
    return(
        <>
          <Header />
          {/* <Jumbotron /> */}
          <div className="flex justify-center pt-4 bg-gray-100">
            <Card className="w-full md:w-[500px]">
              <div className="mb-4 flex-col items-center justify-between gap-2 print:hidden">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">Generate QR Code</h5>
                  <TextInput 
                    type="text"
                    onChange={(e) => setInputValue(e.target.value)} 
                    value={inputValue}
                    placeholder="Enter text or URL" required /> <br/>
                  <Button onClick={handleGenerateQrCode}>Generate QR Code</Button>
                  {qrValue && (
                    <div style={{ marginTop: '20px' }}>
                      <QRCode value={qrValue} size={100} level="H" />
                    </div>
                  )}
              </div>
              <TextInput 
                type="number"
                className="print:hidden"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}/> <br/>   
              
              <Button onClick={handleGenerateBatch} className="print:hidden">Generate {count} Code</Button>  

              {/* Grid of QR Codes */}
              <Button onClick={handlePrint} className="print:hidden" >Print All QR</Button>  
              <div className="grid grid-cols-4 gap-6 print:grid-cols-5 print:gap-4">
                {qrList.map((qr) => (
                  <div key={qr.id} className="flex flex-col items-center">
                    <QRCode value={qr.value} size={100} level="H" />
                    <p className="mt-2 text-sm">{qr.value}</p>
                  </div>
                ))}
              </div>                      
            </Card>
            
          </div>
        </>
    )
}