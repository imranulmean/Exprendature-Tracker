import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import expRoutes from './routes/exp.route.js';
import incomeRoutes from './routes/income.route.js';
import adminRoutes from './routes/adminApi.route.js';
import postgresRoutes from './routes/postgres.route.js';
// import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { decodeServerAccessToken, deleteFile, getFile, getFiles, getServerAccessToken, getStorage, getToken, setFilePermission, uploadDrive, uploadLocal } from './controllers/drive.controller.js';
// import { pool } from './utils/initDb.js';
// import { deleteTables, initializeTables } from './utils/createTables.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

// const postgresTime = await pool.query('select now()');
// console.log(postgresTime.rows)
// // await initializeTables();
// // await deleteTables();

const __dirname = path.resolve();

const app = express();
const server= http.createServer(app);

app.use(cors({
  origin: ['http://localhost:5173',"https://exp-tracker-face.vercel.app"],
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());



server.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

// app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/adminApi', adminRoutes);


app.get("/getFiles", getFiles);
app.post("/setFilePermission", setFilePermission);
app.get('/getServerAccessToken', getServerAccessToken);
app.get('/decodeServerAccessToken', decodeServerAccessToken);
// app.get("/getFile/:fileId", getFile);
// app.post("/uploadDrive", uploadDrive);
// app.post("/uploadLocal", uploadLocal);

app.post("/delete-file", deleteFile);
app.get("/getToken", getToken);
app.get("/getStorage", getStorage);

// app.use('/postgres', postgresRoutes)


// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

  // "scripts": {
  //   "dev": "nodemon api/index.js",
  //   "start": "node api/index.js",
  //   "build": "npm install && npm install --prefix client && npm run build --prefix client"
  // },
  import { Server } from "socket.io";

  const users = {};
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  io.on("connection", (socket) => {
  
    users[socket.id] = socket.id;
    // 1. Send the connected user their unique ID
    socket.emit("me", socket.id);
  
    // 2. Send the updated user list to EVERYONE
    io.emit("updateUserList", Object.values(users));
    socket.on("disconnect", () => {
      delete users[socket.id]; // Remove user
      io.emit("updateUserList", Object.values(users)); // Update everyone
      socket.broadcast.emit("callEnded");
    });
  
    // 3. User A initiates a call to User B
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { 
              signal: data.signalData, 
              from: data.from, 
              name: data.name 
          });
    });
  
    // 4. User B answers the call from User A
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
  