import express from 'express';
import dotenv from 'dotenv';
import connectdb from './database.js';
import stockRoute from './routes/routes.js';
import cors from 'cors';  // Import cors package

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectdb();

// Enable CORS with specific origin
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests from the client running on port 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods
  allowedHeaders: ['Content-Type'],  // Allow specific headers
};

// Middleware
app.use(cors(corsOptions));  // Use CORS middleware with the options
app.use(express.json());

// Routes
app.use("/api/stocks", stockRoute);

// Start the server on the port specified in the .env file
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
