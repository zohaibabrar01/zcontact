const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Increase the request size limit in bodyParser
app.use(bodyParser.json({ limit: '50mb' }));  // Set the limit according to your needs
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://zohaibfouzan1234:hDPTB1Prk2m5j0Dg@cluster0.td6fu.mongodb.net/clist?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })  // Optional: Set a timeout for MongoDB connection
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    contacts: [
        {
            name: String,
            phones: [String]
        }
    ]
});

const User = mongoose.model('User', userSchema);

// API to submit user and contacts
app.post('/api/users', async (req, res) => {
    try {
        const { username, contacts } = req.body;

        if (!username || !contacts || contacts.length === 0) {
            return res.status(400).json({ message: 'Username and contacts are required' });
        }

        const user = new User({ username, contacts });
        await user.save();
        res.json({ message: 'User and contacts saved successfully', user });
    } catch (error) {
        console.error('Error saving user and contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// API to retrieve all users and contacts
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
