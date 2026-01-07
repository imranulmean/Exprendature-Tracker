import multer from 'multer'
import { google } from "googleapis";
import fs from "fs";
import { Readable } from "stream";
import dotenv from 'dotenv';

dotenv.config();

const uploadMemory = multer({
    storage: multer.memoryStorage() 
  });


const storageLocal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});


const storageDrive = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "DriveUploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadLocalMul = multer({ storage:storageLocal });  
const uploadDriveStorage = multer({ storage:storageDrive });  

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.URL
);


// 2. Set the Refresh Token (This is your "Master Key")
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });
const folderId = process.env.FOLDER_ID;
  
export const getFiles = async(req, res) =>{
    try {
        let fileCount = 0;
        let nextPageToken = null;
        let fileDetails=[];
        // Use a loop to handle multiple pages of results
        do {
        const response = await drive.files.list({
            // Filter: Only files in your folder, not in trash, and NOT folders
            q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
            fields: "nextPageToken, files(id, name, webContentLink, webViewLink, thumbnailLink, fileExtension, mimeType)",
            pageSize: 1000,
            pageToken: nextPageToken,
        });
    
        fileCount += response.data.files.length;
        nextPageToken = response.data.nextPageToken;
        fileDetails=response.data.files;
    
        } while (nextPageToken);
    
        res.json({ success: true, totalFiles: fileCount, fileDetails });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ error: "Could not count files" });
    }
}

export const getFile = async (req, res) =>{
    const { fileId, userEmail } = req.params;
    if(!userEmail) return res.status(500).json({success:false, message:"You are not allowed to Delete"});
    try {
        const data=await drive.files.get({
            fileId: fileId,
            fields:'owners'
        });
        const owners=data.data.owners;
        for(let o of owners){
            console.log(o.emailAddress);
        }
        res.json({ success: true, message: "File deleted successfully" , data});
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Failed to delete file", details: error.message });
    }
}

export const uploadDrive = async(req, res) =>{
    console.log("Upload Api Hit")
    try{
        uploadMemory.array("files")(req, res, async (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({ error: err.message });
        } 
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files" });
        
        const uploadedFiles = [];
    
        console.log(`Starting upload for ${req.files.length} files...`);
    
        try {
            for (const file of req.files) {
            console.log(`Uploading: ${file.originalname}`);
            const customFileName = Date.now() + "-" + file.originalname;
            const response = await drive.files.create({
                requestBody: {
                    name: customFileName,
                    parents: [folderId],
                },
                media: {
                    mimeType: file.mimetype,
                    // body: fs.createReadStream(file.path),
                    body: Readable.from(file.buffer),
                },
                fields: 'id, name, webContentLink, webViewLink',
            }, {
                timeout: 0,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });
            if(response.data.id) console.log(`Uploaded-----: ${file.originalname}`);
            // Delete local file after successful upload to save disk space
            // fs.unlinkSync(file.path);
            // Set permission to "anyone with link can view"
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                role: 'reader',
                type: 'anyone',
                },
            });
    
                uploadedFiles.push({
                    name: response.data.name,
                    id: response.data.id,
                    url: `https://drive.google.com/uc?id=${response.data.id}`,
                    res:response.data
                });
            }
    
            res.json({ success: true, count: uploadedFiles.length, files: uploadedFiles });
        } catch (error) {
            console.log("Upload Loop Error:", error);
            res.status(500).json({ error: "Drive upload failed", details: error.message });
        }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Drive upload failed", details: error.message });
    }
} 

export const setFilePermission = async (req, res) =>{
    const { fileId } = req.body;

    try {
    
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      res.json({ success: true, message: "File is now public" });
    } catch (error) {
      console.error("Permission Error:", error);
      res.status(500).json({ error: "Failed to set permission" });
    }    
}

export const deleteFile = async (req, res) =>{
    const { fileId, userEmail } = req.body;
    if(!userEmail) return res.status(403).json({success:false, message:"No Email Found"});
    try {
        // This permanently deletes the file. 
        // Use drive.files.update with trashed: true if you want to move it to trash instead.
        const data=await drive.files.get({
            fileId: fileId,
            fields:'owners'
        });
        const owners=data.data.owners;
        const isOwner=owners.some((o)=>{
            return o.emailAddress == userEmail
        })        
        if (isOwner) {
            await drive.files.delete({
                fileId: fileId,
            });
            return res.json({ success: true, message: "File deleted successfully" });
        } else {
            return res.status(403).json({ success: false, message: "You are not allowed to delete this file" });
        }       
            
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Failed to delete file", details: error.message });
    }
}

export const uploadLocal = async(req, res)=>{    
    uploadLocalMul.array("files")(req, res, (err) => {
        try {
            if (err) {
                console.error("Multer Error:", err);
                return res.status(500).json({ error: err.message });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "No files uploaded" });
            }
            res.json({ success: true, count: req.files.length,});
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

export const getToken = async (req, res) =>{
    try {
        const {token}=await oauth2Client.getAccessToken();
        res.json({ success: true, folderId:'1I2a7_eRW6CoBsdu-0UjSaj15iSPHyWZi',token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }    
} 