import { useState } from 'react';
import api from '../api';
import { useToast } from './ToastContainer';
import '../styles/Form.css';
import LoadingIndicator from './LoadingIndicator';

function Form({ route, method, onSuccess }) {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const name = method === 'login' ? 'Login' : 'Register';

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await api.post(route, { username, password });
      
      if (method === 'login') {
        showToast('Login successful!', 'success');
        if (onSuccess && res.data.access && res.data.refresh) {
          onSuccess(res.data.access, res.data.refresh);
        }
      } else {
        showToast('Registration successful! Please login.', 'success');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.username?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'An error occurred';
      
      if (error.response?.status === 400) {
        const fieldErrors = error.response.data;
        const newErrors = {};
        if (fieldErrors.username) {
          newErrors.username = Array.isArray(fieldErrors.username) 
            ? fieldErrors.username[0] 
            : fieldErrors.username;
        }
        if (fieldErrors.password) {
          newErrors.password = Array.isArray(fieldErrors.password) 
            ? fieldErrors.password[0] 
            : fieldErrors.password;
        }
        setErrors(newErrors);
      }
      
      // Toast is already shown by API interceptor, but show a more specific message if available
      if (!error.response?.data?.username && !error.response?.data?.password) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-header">
          <h1>{name}</h1>
          <p className="form-subtitle">
            {method === 'login' 
              ? 'Welcome back! Please login to your account' 
              : 'Create a new account to get started'}
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            className={`form-input ${errors.username ? 'form-input-error' : ''}`}
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors({ ...errors, username: '' });
            }}
            placeholder="Enter your username"
            disabled={loading}
            autoComplete="username"
          />
          {errors.username && <span className="form-error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            placeholder="Enter your password"
            disabled={loading}
            autoComplete={method === 'login' ? 'current-password' : 'new-password'}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        {loading && (
          <div className="form-loading">
            <LoadingIndicator />
          </div>
        )}

        <button className="form-button" type="submit" disabled={loading}>
          {loading ? 'Processing...' : name}
        </button>

        {method === 'login' && (
          <p className="form-footer">
            Don't have an account?{' '}
            <a href="/register" className="form-link">
              Sign up here
            </a>
          </p>
        )}

        {method === 'register' && (
          <p className="form-footer">
            Already have an account?{' '}
            <a href="/login" className="form-link">
              Login here
            </a>
          </p>
        )}
      </form>
    </div>
  );
}

export default Form;