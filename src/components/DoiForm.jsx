import React, { useState } from 'react';
import './DoiForm.css';

function DoiForm({ onTaskCreated }) {
  const [doi, setDoi] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/papers/doi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doi,
          topic_list: topics ? topics.split(',').map(t => t.trim()) : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process DOI');
      }

      const data = await response.json();
      onTaskCreated(data.task_id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="doi-form">
      <h2>Process Paper from DOI</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doi">DOI:</label>
          <input
            id="doi"
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="10.xxxx/xxxxx"
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
          {loading ? 'Processing...' : 'Process Paper'}
        </button>
      </form>
    </div>
  );
}

export default DoiForm;