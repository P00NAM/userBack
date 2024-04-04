// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://singhyashika1104:Poonam123@cluster0.36vy8o7.mongodb.net/userDB');
//mongoose.connect('mongodb://localhost:27017/userDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User Schema
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    avatar: String,
    domain: String,
    gender: String,
    availability: String
});

const User = mongoose.model('User', userSchema);


app.get('/api/users', async (req, res) => {
    try {
        const { page = 1, limit = 20, domain, gender, availability, search } = req.query;

    
        const filter = {};
        if (domain) filter.domain = domain;
        if (gender) filter.gender = gender;
        if (availability) filter.availability = availability;
        if (search) {
            filter.name = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
        }


        const options = {
            limit: parseInt(limit),
            skip: (page - 1) * limit
        };

     
        const users = await User.find(filter, null, options);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST a new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT (update) an existing user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// POST a new team by selecting users with unique domains and availability
app.post('/api/team', async (req, res) => {
    try {
       
        res.json({ message: 'Team created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET the details of a specific team by ID
app.get('/api/team/:id', async (req, res) => {
    try {
        // Logic to retrieve team details by ID
        // Implement as per your requirements
        res.json({ message: 'Team details retrieved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
