import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Note from './models/Note.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error: ", err));

// --- RESTful API Routes ---

// 1. CREATE a new note (POST)
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const newNote = new Note({ title, content, category });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. READ all notes (GET - with optional category filter)
app.get('/api/notes', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        if (category && category !== 'All') {
            query.category = category;
        }

        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE a note (PUT)
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, category },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. DELETE a note (DELETE)
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});