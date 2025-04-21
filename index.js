import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Configurations/DBConnect.js';
import authRoutes from './Routes/authRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/auth', authRoutes)

app.listen(PORT,() => {
    connectDB();
    console.log('backend is running on port:', PORT)
})