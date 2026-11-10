import { useState, useEffect } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "./services/api";
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Work");
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  // Track if we are currently editing a note
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes(selectedFilter);
  }, [selectedFilter]);

  const fetchNotes = async (filter) => {
    try {
      const data = await getNotes(filter);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) return alert("Please fill in all fields");
    
    try {
      if (editingId) {
        // Update existing note
        await updateNote(editingId, { title, content, category });
        setEditingId(null);
      } else {
        // Create new note
        await createNote({ title, content, category });
      }

      // Reset form
      setTitle("");
      setContent("");
      setCategory("Work");
      fetchNotes(selectedFilter);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEditClick = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("Work");
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes(selectedFilter);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>MERN Notes & Tasks App</h1>

      {/* Form to Create / Edit a Note */}
      <form onSubmit={handleSubmit} className="note-form">
        <h2>{editingId ? "Edit Note" : "Create a New Note"}</h2>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
        </div>
        <div>
          <textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">
            {editingId ? "Update Note" : "Add Note"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', alignItems: 'center' }}>
        <strong>Filter:</strong>
        {['All', 'Work', 'Personal', 'Study'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: selectedFilter === cat ? '#38bdf8' : '#334155',
              color: selectedFilter === cat ? '#0f172a' : '#f8fafc',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Display the list of notes */}
      <h2>Your Notes</h2>
      {notes.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No notes available in this category.</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              <span className="note-category">{note.category}</span>
              <h3 style={{ margin: '12px 0 8px 0', color: '#f8fafc' }}>{note.title}</h3>
              <p style={{ margin: '0 0 15px 0', color: '#94a3b8', lineHeight: '1.5' }}>{note.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#64748b' }}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </small>
                <div>
                  <button
                    onClick={() => handleEditClick(note)}
                    style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '0.85rem' }}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;