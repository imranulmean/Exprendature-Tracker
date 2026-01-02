import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import expRoutes from './routes/exp.route.js';
import incomeRoutes from './routes/income.route.js';
import adminRoutes from './routes/adminApi.route.js';
// import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import cors from 'cors';
import multer from 'multer'


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
const server= http.createServer(app);

app.use(cors({
  // origin: ['http://localhost:5173',"https://exp-tracker-face.vercel.app"],
  origin: '*',
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

//To Upload Files //

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", (req, res) => {
  upload.array("files")(req, res, (err) => {
    try {
      if (err) {
        console.error("Multer Error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      res.json({
        success: true,
        count: req.files.length,
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// app.use('/api/comment', commentRoutes);

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