import {useState, useRef} from "react";
import {Button } from "flowbite-react";
import NoSleep from "nosleep.js";

export default function UploadFile(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const fileInputRef = useRef(null);
    const [files, setFiles]=useState();
    const [loading, setLoading]=useState(false);
    const [wakeLockActivate, setWakeLockActivate] = useState(false);
    const [progress, setProgress] = useState(0);
    const noSleepRef = useRef(null);

    if (!noSleepRef.current) {
        noSleepRef.current = new NoSleep();
      }

    const enableNoSleep = async () => {
        try {
            noSleepRef.current.enable();
            console.log("NoSleep enabled");
            setWakeLockActivate(true);
        } catch (err) {
            console.error("NoSleep enable failed:", err);
        }
    };
    const disableNoSleep = () => {
        try {
          noSleepRef.current.disable();
          console.log("NoSleep disabled");
          setWakeLockActivate(false);
        } catch (err) {
          console.error("NoSleep disable failed:", err);
        }
      };    
    // const handleUpload=async()=>{        
    //     if(!files) return alert("select Files")
    //     setLoading(true);
    //     await enableNoSleep();
    //     const fomrData= new FormData();
    //     for (let i=0; i< files.length; i++){
    //         fomrData.append("files", files[i]);
    //     }
    //     try {
    //         const res= await fetch(`${BASE_API}/upload`,{
    //             method:"POST",
    //             body:fomrData
    //         })
    //         if(res.ok){
    //             alert("Files Uploaded Succes")

    //         } 

    //     }
    //     catch(e){
    //         alert(e)
    //         setFiles(null);
    //     }
    //     finally{
    //         disableNoSleep();
    //         setLoading(false);
    //         setFiles(null);
    //         if (fileInputRef.current) {
    //           fileInputRef.current.value = "";
    //         }
    //     }
    // }

    const handleUpload = async () => {
        if (!files?.length) return alert("Select Files");
      
        setLoading(true);
        setProgress(0);
        await enableNoSleep();
      
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      
        try {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${BASE_API}/upload`);
      
            // ✅ PROGRESS TRACKING
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round(
                  (event.loaded / event.total) * 100
                );
                setProgress(percent);
                console.log("Upload:", percent + "%");
              }
            };
      
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
              } else {
                reject(xhr.statusText);
              }
            };
      
            xhr.onerror = () => reject("Upload failed");
      
            xhr.send(formData);
          });
      
          alert("Files Uploaded Success");
      
        } catch (err) {
          console.error(err);
          alert("Upload Error");
        } finally {
          disableNoSleep();
          setLoading(false);
          setFiles(null);
          setProgress(0);
      
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };    

    return(
        <>
            File uploader
            <input type="file" multiple onChange={(e)=>setFiles(e.target.files)}  ref={fileInputRef}/>
            {loading && 
                <div>
                    <p>Uploading...{progress}%</p>
                    <progress value={progress} max="100" />
                </div>
                
            }            
            <Button onClick={handleUpload} disabled={loading}>Upload</Button>
            {
                wakeLockActivate && <p>Wake lock Activated</p>
            }
            
        </>
    )
}