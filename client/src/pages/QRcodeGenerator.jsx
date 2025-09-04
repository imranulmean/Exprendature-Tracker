import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import QRCode from 'react-qr-code';
import { useState } from "react";
import { Card, TextInput, Button } from "flowbite-react";

export default function QRcodeGenerator(){

    // const [inputValue, setInputValue] = useState('');
    // const [qrValue, setQrValue] = useState('');    

    // const handleGenerateQrCode = () => {
    //     setQrValue(inputValue);
    //   };
    
    // return(
    //     <>
    //       <Header />
    //       <Jumbotron />
    //       <div className="flex justify-center pt-4 bg-gray-100">
    //         <Card className="w-full md:w-[500px]">
    //             <div className="mb-4 flex-col items-center justify-between gap-2">
    //                 <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">Generate QR Code</h5>
    //                 <TextInput 
    //                           type="text"
    //                           onChange={(e) => setInputValue(e.target.value)} 
    //                           value={inputValue}
    //                           placeholder="Enter text or URL" required /> <br/>
    //                 <Button onClick={handleGenerateQrCode}>Generate QR Code</Button>
    //                 {qrValue && (
    //                   <div style={{ marginTop: '20px' }}>
    //                     <QRCode value={qrValue} size={100} level="H" />
    //                   </div>
    //                 )}
    //             </div>
    //         </Card>                
    //       </div>
    //     </>
    // )
    const [inputValue, setInputValue] = useState("");
    const [count, setCount] = useState(20); // default number of QR codes
    const [qrList, setQrList] = useState([]);
    
    const handleGenerateBatch = () => {
      if (!inputValue) return;
      const newList = Array.from({ length: count }, (_, i) => ({
        id: i,
        value: inputValue,
      }));
      setQrList(newList);
    };
  
    const handlePrint = () => {
      window.print();
    };
    return (
      <>
        <Header />
        <Jumbotron />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Batch QR Code Generator</h2>
    
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter text or URL"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 border p-2 rounded"
              min="1"
              max="200"
            />
            <button
              onClick={handleGenerateBatch}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>
          </div>
    
          {qrList.length > 0 && (
            <>
              <button
                onClick={handlePrint}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Print QR Codes
              </button>
    
              {/* Grid of QR Codes */}
              <div className="grid grid-cols-4 gap-6 print:grid-cols-5 print:gap-4">
                {qrList.map((qr) => (
                  <div key={qr.id} className="flex flex-col items-center">
                    <QRCode value={qr.value} size={100} level="H" />
                    <p className="mt-2 text-sm">{qr.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>      
      </>
    );    
}