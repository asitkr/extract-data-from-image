const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/connectDB');

// express object and dotenv configure
const app = express();
dotenv.config();

// Database connection
connectDB();

// PORt
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/metadata', require('./routes/metaDataRoute'));

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));