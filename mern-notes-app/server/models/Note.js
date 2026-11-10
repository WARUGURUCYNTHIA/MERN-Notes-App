import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    }, 
    category: {
        type: String,
        required: true,
        index: true,
    }}, {
    timestamps: true
});

const Note = model('Note', noteSchema);

export default Note; 
