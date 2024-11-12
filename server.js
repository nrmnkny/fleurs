const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
