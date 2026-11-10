import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notes';

export const getNotes = async (category = '') => {
    const url = category && category !== 'All' 
        ? `${API_URL}?category=${category}` 
        : API_URL;
    const response = await axios.get(url);
    return response.data;
};

export const createNote = async (noteData) => {
    const response = await axios.post(API_URL, noteData);
    return response.data;
};

export const updateNote = async (id, noteData) => {
    const response = await axios.put(`${API_URL}/${id}`, noteData);
    return response.data;
};

export const deleteNote = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};