import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app = express();// Initialize express app
const PORT = process.env.PORT || 4000;// Server port

// Connect to MongoDB
connectDB();

// Needed for JSON request body parsing
app.use(express.json());
// Needed for cookies (JWT auth)
app.use(cookieParser());
 
//CORS setup (for frontend)
app.use(cors({
  origin: 'http://localhost:3000',   // frontend URL 
  credentials: true
}));

// API Endpoints
app.get('/', (_req, res) => {
  res.send('API is working');
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/user', userRouter);

// Start Server 
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
}); 
