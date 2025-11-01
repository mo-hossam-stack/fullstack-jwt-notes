import React from 'react';
import '../styles/Note.css';

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(note.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          className="delete-button"
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          title="Delete note"
        >
          <span className="delete-icon">🗑️</span>
        </button>
      </div>
      <div className="note-body">
        <p className="note-content">{note.content}</p>
      </div>
      <div className="note-footer">
        <span className="note-date">
          {formattedDate} at {formattedTime}
        </span>
      </div>
    </div>
  );
}

export default Note;