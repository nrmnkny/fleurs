const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000', 
  'https://mynewscript.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// Define routes
const postRoutes = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const authMiddleware = require('./middleware/authMiddleware'); 

app.get('/', (req, res) => res.send("Welcome to the Fleurs API"));
app.use('/api/posts', postRoutes);
app.use('/api', authRoutes);
app.use(authMiddleware); 
app.use('/api/admin/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
