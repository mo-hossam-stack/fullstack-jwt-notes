import { useState, useEffect } from 'react';
import api from '../api';
import Note from '../components/Note';
import LoadingIndicator from '../components/LoadingIndicator';
import { useToast } from '../components/ToastContainer';
import '../styles/Home.css';

function Home() {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/notes/');
      setNotes(res.data);
    } catch (error) {
      // Error is already handled by interceptor
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await api.delete(`/api/notes/delete/${id}/`);
      showToast('Note deleted successfully!', 'success');
      getNotes();
    } catch (error) {
      // Error is already handled by interceptor
      console.error('Failed to delete note:', error);
    }
  };

  const validateNote = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createNote = async (e) => {
    e.preventDefault();

    if (!validateNote()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/api/notes/', { content, title });
      if (res.status === 201) {
        showToast('Note created successfully!', 'success');
        setTitle('');
        setContent('');
        setErrors({});
        getNotes();
      }
    } catch (error) {
      // Error is already handled by interceptor
      const fieldErrors = error.response?.data;
      if (fieldErrors) {
        const newErrors = {};
        if (fieldErrors.title) {
          newErrors.title = Array.isArray(fieldErrors.title) 
            ? fieldErrors.title[0] 
            : fieldErrors.title;
        }
        if (fieldErrors.content) {
          newErrors.content = Array.isArray(fieldErrors.content) 
            ? fieldErrors.content[0] 
            : fieldErrors.content;
        }
        setErrors(newErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">My Notes</h1>
        <p className="home-subtitle">Organize your thoughts and ideas</p>
      </div>

      <div className="home-content">
        <section className="notes-section">
          <h2 className="section-title">Your Notes</h2>
          {loading ? (
            <div className="notes-loading">
              <LoadingIndicator />
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No notes yet</h3>
              <p>Create your first note below to get started!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <Note note={note} onDelete={deleteNote} key={note.id} />
              ))}
            </div>
          )}
        </section>

        <section className="create-note-section">
          <h2 className="section-title">Create New Note</h2>
          <form onSubmit={createNote} className="note-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Enter note title"
                disabled={submitting}
                maxLength={100}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
              <span className="char-count">{title.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                className={`form-textarea ${errors.content ? 'form-input-error' : ''}`}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors({ ...errors, content: '' });
                }}
                placeholder="Write your note content here..."
                disabled={submitting}
                rows={6}
              />
              {errors.content && <span className="form-error">{errors.content}</span>}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={submitting || !title.trim() || !content.trim()}
            >
              {submitting ? (
                <>
                  <LoadingIndicator />
                  Creating...
                </>
              ) : (
                'Create Note'
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Home;