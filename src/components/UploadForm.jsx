import React, { useState } from 'react';
import './UploadForm.css';

function UploadForm({ onTaskCreated }) {
  const [file, setFile] = useState(null);
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('topics', topics);
      
      const response = await fetch('http://localhost:8000/papers/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onTaskCreated(data.task_id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload Research Paper</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">PDF File:</label>
          <input
            id="file"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="topics">Topics (comma separated):</label>
          <input
            id="topics"
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g., artificial intelligence, neural networks"
          />
        </div>
        
        <button type="submit" disabled={loading}          
        style={{
            backgroundColor: 'white',
            border: '2px solid',
            borderColor: '#4a6fa5',
            color: '#4a6fa5',
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>
          {loading ? 'Uploading...' : 'Upload and Process'}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;