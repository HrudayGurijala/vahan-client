import React from 'react';
import './SearchResults.css';

function SearchResults({ results, onSelect }) {
  if (!results || results.length === 0) {
    return <div className="no-results">No papers found</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <p>{results.length} papers found</p>

      <div className="results-list">
        {results.map((paper, index) => (
          <div key={index} className="paper-item">
            <h3>{paper.title}</h3>
            <p className="authors">
              <strong>Authors:</strong> {paper.authors.join(', ')}
            </p>
            <div className="abstract">
              <strong>Abstract:</strong>
              <p>{paper.abstract}</p>
            </div>
            {paper.publication_date && (
              <p><strong>Published:</strong> {new Date(paper.publication_date).toLocaleDateString()}</p>
            )}
            <div className="actions">
              <button onClick={() => onSelect(paper)} 
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
                Process Paper
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
