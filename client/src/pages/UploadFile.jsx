import {useState, useRef, useEffect} from "react";
import NoSleep from "nosleep.js";
import axios from "axios";
import { Card, TextInput, Button, Timeline, Modal, ModalBody, ModalFooter, ModalHeader  } from "flowbite-react";
import { useSelector } from 'react-redux';

export default function UploadFile(){

    const { currentUser } = useSelector((state) => state.user);
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const fileInputRef = useRef(null);
    const [files, setFiles]=useState();
    const [loading, setLoading]=useState(false);
    const [wakeLockActivate, setWakeLockActivate] = useState(false);
    const [progress, setProgress] = useState(0);
    const noSleepRef = useRef(null);
    const [driveFiles, setDriveFiles] = useState(null);
    const [deleting, setDeleting]= useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [fileLink, setFileLink]= useState(null);
    const [directUploadProgress, setDirectUploadProgress] = useState(0);
    const [currentFile, setCurrentFile]= useState('');
    const [totalFileSize, setTotalFileSize] = useState(0);

    if (!noSleepRef.current) {
        noSleepRef.current = new NoSleep();
      }

      useEffect(()=>{
        getFiles();
      },[])
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

      const getTotalFileSize = () => {
        
        if (!files?.length) {
          alert("Select Files");
          return false;
        }
        setTotalFileSize(0);      
        const MAX_SIZE_MB = 500;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
      
        const totalSizeBytes = Array.from(files).reduce((acc, file) => acc + file.size, 0);
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
        setTotalFileSize(totalSizeMB);
        if (totalSizeBytes > MAX_SIZE_BYTES) {
          alert(`Total file size (${totalSizeMB} MB) exceeds the ${MAX_SIZE_MB} MB limit.`);
          return false;
        }
      
        return true;
      }
      
    const serverUpload = async (uploadDestination) => {
       
        const isSizeValid = getTotalFileSize();
        if (!isSizeValid) return;
        setLoading(true);
        setProgress(0);
        await enableNoSleep();
      
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
        try {
            const res = await axios.post(`${BASE_API}/${uploadDestination}`,formData,{
                onUploadProgress:(event)=>{
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setProgress(percent);
                    console.log("Upload:", percent + "%");
                }
                }
            })
            if(res.data.success) alert("Files Uploaded Success");
      
        } catch (err) {
          console.error(err);
          alert(err);
        } finally {
          disableNoSleep();
          setLoading(false);
          setFiles(null);
          setProgress(0);
          await getFiles();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };    

    const getFiles = async() =>{
      const res= await fetch(`${BASE_API}/getFiles`);
      const data2=await res.json();
      setDriveFiles(data2);
      
    }
    const openFileInModal= (fl) =>{
      console.log(fl)
      setFileLink(fl)
      setOpenModal(true);
    }
    const deleteFiles = async(fileId) =>{
      setDeleting(true);
      const obj={
        userEmail:currentUser.email,
        fileId
      }
      try{
        const res= await fetch(`${BASE_API}/delete-file`,{
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify(obj)
        });
        const result = await res.json();
        // alert(result.message)
        if(result.success){
          await getFiles();
        }
        else{
          alert(result.message)
        }

      }catch(err){
        alert(err);
      }
      finally{
        setDeleting(false);
      }
    }

    const getToken= async()=>{
      try{
        const res= await fetch(`${BASE_API}/getToken`);
        const result = await res.json();
        return result

      }catch(err){
        alert(err);
      }     
    }

    const directUpload =  async()=>{
      const isSizeValid = getTotalFileSize();
      if (!isSizeValid) return;
      /////////////////////////
      try {
        setLoading(true);
        setProgress(0);        
        // 1. Get the token once
        const token= await getToken();
        const fileList = Array.from(files);
    
        for (const file of fileList) {
          console.log(`Uploading ${file.name}...`);
          setDirectUploadProgress(0);
          setCurrentFile(file.name);
          // 2. Initiate Resumable Session
          const customFileName = Date.now() + "-" + file.name;
          const metadata = {
            name: customFileName,
            mimeType: file.type,
            parents: [`${token.folderId}`] 
          };
    
          const initRes = await axios.post(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
            metadata,
            { headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' } }
          );

          const uploadUrl = initRes.headers.location;
    
          // 3. PUT the file bytes directly to Google
          const uploadRes = await axios.put(uploadUrl, file, {
            onUploadProgress: (p) => {
              const progress = Math.round((p.loaded / p.total) * 100);
              console.log(`${file.name}: ${progress}%`);
              setDirectUploadProgress(progress);
            }
          });
    
          const fileId = uploadRes.data.id;
          setCurrentFile('');
        }
    
        alert("All uploads complete!");
      } catch (err) {
        console.error("Critical upload error:", err);
        alert(err);
      } finally {
        setLoading(false);
        setFiles(null);
        setDirectUploadProgress(0);
        await getFiles();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }      
      ////////////////////////
    }

    return(
        <div className="w-full bg-gray-200">

        {/* ////////////// File Uploader ///////////// */}
          <div className="p-4">
            File uploader
            <input type="file" accept="image/*,video/*" multiple onChange={(e)=>setFiles(e.target.files)}  ref={fileInputRef} disabled={loading}/>
            {loading && 
                <div>
                    {/* <p>Uploading...{progress}%</p>
                    <progress value={progress} max="100" /> */}
                    <p>Total Size:{totalFileSize} MB</p>
                    <p>{currentFile} Uploading...{directUploadProgress}%</p>
                    <progress value={directUploadProgress} max="100" />                
                </div>
                
            }
            {
              progress==100 && <p>Processing...</p>
            } 
            <div className="flex gap-2 p-2">
              {/* <Button onClick={()=>serverUpload('uploadDrive')} disabled={loading}>Upload Drive</Button> */}
              <Button onClick={directUpload} disabled={loading}>Direct Upload</Button>
              {/* <Button color='light' onClick={()=>serverUpload('uploadLocal')} disabled={loading}>Upload Local</Button>               */}
            </div>        

            {
                wakeLockActivate && <p>Wake lock Activated</p>
            }
          </div>            
        {/* ////////////// File Uploader end///////////// */}
          <div className="p-4">
            <h2>My Drive Files ({driveFiles?.totalFiles})</h2>
            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
              <ModalBody>
                <iframe
                  src={fileLink}
                  width="100%"
                  height="500px"
                  className="rounded-lg"
                  allowFullScreen>
                </iframe>             
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setOpenModal(false)}>Close</Button>
              </ModalFooter>            
            </Modal>            
            <div className="flex flex-col md:flex-row justify-center gap-2 flex-wrap">
              {driveFiles?.fileDetails.map((file) => (
                <div key={file.id} >              
                  <Card className=" flex w-full overflow-hidden justify-center items-center">
                    {
                      file.thumbnailLink ?
                      <img src={file.thumbnailLink.replace('=s220','=s400')} 
                            referrerPolicy="no-referrer"/>
                      :
                      <img src='https://www.biblecenterchurch.com/wp-content/uploads/2018/10/video-placeholder-300x169.png' 
                          onClick={() => openFileInModal(file.webViewLink.replace('/view?usp=drivesdk', '/preview'))}  
                      />
                    }
                    
                    <div className="flex gap-2">                          
                      <Button color="light">
                          <a href={file.webViewLink} target="_blank" rel="noreferrer">View in Drive</a>
                      </Button>
                      <Button  onClick={()=>  openFileInModal(file.webViewLink.replace('/view?usp=drivesdk', '/preview'))} >
                          Full View
                        </Button>                    
                      {
                        currentUser&&
                        <Button  onClick={()=> deleteFiles(file.id)} disabled={deleting}>
                          Delete file
                        </Button> 
                      }               
                              
                    </div> 

                  </Card>                  
                </div>
              ))}
            </div>
          </div>

        </div>
    )
}