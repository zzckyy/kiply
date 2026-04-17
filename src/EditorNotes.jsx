import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';


function EditorNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: '', content: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (id) {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      const existingNote = notes.find(n => n.id === parseInt(id));
      if (existingNote) {
        setNote({ title: existingNote.title, content: existingNote.content });
      }
    } else {
      // Focus on title for new note
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [id]);

  // Autosave effect
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveNote(true); // Silent save
        setHasUnsavedChanges(false);
      }, 2000); // Autosave after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [note, hasUnsavedChanges]);

  const handleChange = (field, value) => {
    setNote(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const saveNote = (silent = false) => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (id) {
      // Edit existing
      const updatedNotes = notes.map(n =>
        n.id === parseInt(id) ? { ...n, title: note.title, content: note.content } : n
      );
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } else {
      // Add new
      const newNote = {
        id: Date.now(),
        title: note.title,
        content: note.content,
        createdAt: new Date().toISOString(),
      };
      notes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(notes));
    }
    if (!silent) {
      navigate('/');
    }
  };

  const cancel = () => {
    navigate('/');
  };

  return (
    <div className="editor-container">
      <div className="editor-header is-flex is-justify-content-space-between mb-4 ">
        <button className="back-btn" onClick={cancel}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <button className="save-btn" onClick={() => saveNote()}>
          Save
        </button>
      </div>
      <div className="editor-content is-flex is-flex-direction-column">
        <input
          ref={titleRef}
          type="text"
          className="editor-title"
          placeholder="Note title..."
          value={note.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <textarea
          ref={contentRef}
          className="editor-text"
          placeholder="Start writing..."
          value={note.content}
          onChange={(e) => handleChange('content', e.target.value)}
        />
      </div>
      {hasUnsavedChanges && (
        <div className="autosave-indicator">
          Saving...
        </div>
      )}
    </div>
  );
}

export default EditorNotes;