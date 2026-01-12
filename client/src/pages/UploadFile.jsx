import {useState, useRef, useEffect} from "react";
import NoSleep from "nosleep.js";
import axios from "axios";
import { Card, TextInput, Button, Timeline, Modal, ModalBody, ModalFooter, ModalHeader, Tabs  } from "flowbite-react";
import { useSelector, useDispatch } from 'react-redux';
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

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
    const [totalUploadedSizeMB, setTotalUploadedSizeMB] = useState(0);
    const [loadedStatus, setLoadedStatus] = useState(0);
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const dispatch = useDispatch();

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
      const newVideos = data2.fileDetails.filter(df => df.mimeType.includes('video'));
      const newImages= data2.fileDetails.filter(df => df.mimeType.includes('image'));
      setVideos(newVideos);
      setImages(newImages);
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
      let totalUploadedSizeBytes= 0;
      if (!isSizeValid) return;
      /////////////////////////
      try {
        setTotalUploadedSizeMB(0);
        setLoading(true);
        setProgress(0); 
        await enableNoSleep();       
        // 1. Get the token once
        const token= await getToken();
        const fileList = Array.from(files);
    
        for (const file of fileList) {
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
              const loadedMB = (p.loaded / (1024 * 1024)).toFixed(2);
              setLoadedStatus(loadedMB);
              const progress = Math.round((p.loaded / p.total) * 100);
              setDirectUploadProgress(progress);
            }
          });
    
          const fileId = uploadRes.data.id;
          await fetch(`${BASE_API}/setFilePermission`,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: fileId })
          });
          totalUploadedSizeBytes = totalUploadedSizeBytes + file.size;
          const totalUploadedMB= (totalUploadedSizeBytes/(1024*1024)).toFixed(2) ;
          setCurrentFile('');
          setTotalUploadedSizeMB(totalUploadedMB);
        }
    
        alert("All uploads complete!");
      } catch (err) {
        console.error("Critical upload error:", err);
        alert(err);
      } finally {
        setLoading(false);
        setFiles(null);
        setDirectUploadProgress(0);
        disableNoSleep();
        await getFiles();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }      
      ////////////////////////
    }

    const handleSignout = async () => {
      try {
        const res = await fetch(`${BASE_API}/api/auth/signout`, {
          method: 'POST',
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };    

    return(
        <div className="w-full bg-gray-200 flex flex-col justify-center items-center p-2">
          {
            !currentUser &&
            <Link to='/login' state={{ from: '/upload' }}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Log in
            </Link>             
          }

          {/* Profile Card           */}
          {
            currentUser &&
            <Card className="max-w-sm">
              <div className="flex flex-col items-center">
                <img
                  alt="Bonnie image"
                  height="40"
                  src={currentUser.profilePicture}
                  width="40"
                  className="mb-3 rounded-full shadow-lg"
                  referrerPolicy="no-referrer"
                />
                {/* <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{currentUser.displayName}</h5> */}
                {/* <span className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</span> */}
                <div className="mt-4 flex space-x-3 lg:mt-6">
                  <button onClick={handleSignout}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </Card>           
          }
       
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
                    <p>Loaded: {loadedStatus} MB</p>
                    <progress value={directUploadProgress} max="100" />   
                    <p>TotalUploaded: {totalUploadedSizeMB} MB</p>             
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
          <div className="p-2">
            <h2>
              Total Files: ({driveFiles?.totalFiles || 0}) 
              {images && images.length > 0 && (
                <span> | Images: {images.length}</span>
              )}
              {videos && videos.length > 0 && (
                <span> | Videos: {videos.length}</span>
              )}
            </h2>           
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
            <Tabs aria-label="Full width tabs" variant="fullWidth">
              <Tabs.Item active title="Images" icon={HiUserCircle}>
                    <div className="w-full flex flex-col justify-center md:flex-row flex-wrap gap-2 bg-gray-100 ">
                      {images.map((file) => (
                        <div key={file.id} >              
                          <Card className=" flex w-full overflow-hidden justify-center items-center">
                            {
                              file.thumbnailLink &&
                              <img src={file.thumbnailLink.replace('=s220','=s400')} referrerPolicy="no-referrer"/>
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
              </Tabs.Item>
              <Tabs.Item title="Videos" icon={MdDashboard}>

                <div className="w-full flex flex-col justify-center md:flex-row flex-wrap gap-2 bg-gray-100 ">
                  {videos.map((file) => (
                    <div key={file.id} >              
                      <Card className=" flex w-full overflow-hidden justify-center items-center">
                        {
                          file.thumbnailLink &&
                          <img src={file.thumbnailLink.replace('=s220','=s400')} referrerPolicy="no-referrer"/>
                        }
                        
                        <div className="flex gap-2">
                          <Button color="light">
                              <a href={file.webViewLink} target="_blank" rel="noreferrer">View in Drive</a>
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
              </Tabs.Item>
            </Tabs>            
          </div>

        </div>
    )
}