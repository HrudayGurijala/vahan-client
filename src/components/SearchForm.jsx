import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [sortBy, setSortBy] = useState('relevance');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/papers/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          max_results: Number(maxResults),
          sort_by: sortBy,
          sort_order: 'descending',
          year_from: yearFrom ? Number(yearFrom) : null,
          year_to: yearTo ? Number(yearTo) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      onSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-form">
      <h2>Search Research Papers</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="query">Search Query:</label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., machine learning, quantum computing"
            required
            style={{
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: '#4a6fa5',
              borderRadius: '4px',
              outline: 'none',
              padding: '8px',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
              color: '#333', // Ensure text color stays consistent
            }}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maxResults">Max Results:</label>
            <input
              id="maxResults"
              type="number"
              min="1"
              max="50"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                padding: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                color: '#333',
                appearance: 'textfield',
              }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                padding: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                color: '#333',
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="lastUpdatedDate">Last Updated</option>
              <option value="submittedDate">Submitted Date</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="yearFrom">Year From:</label>
            <input
              id="yearFrom"
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="YYYY"
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                padding: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                appearance: 'textfield',
                color: '#333',
              }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="yearTo">Year To:</label>
            <input
              id="yearTo"
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="YYYY"
              style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                padding: '8px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                color: '#333',
                appearance: 'textfield',
              }}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: 'white',
            border: '2px solid',
            borderColor: '#4a6fa5',
            color: '#4a6fa5',
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchForm;