import React, { useState, useEffect } from 'react';
import './Summary.css';

function Summary({ summary }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableSummaries, setAvailableSummaries] = useState([]);

  // First check if any summaries are available
  useEffect(() => {
    console.log("Summary object:", summary);
    
    // Make this request to check what summaries are available
    fetch('http://localhost:8000/summaries')
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(`Failed to fetch summaries: ${response.status}`);
      })
      .then(data => {
        console.log("Available summaries:", data);
        setAvailableSummaries(data);
      })
      .catch(err => {
        console.error("Error fetching available summaries:", err);
      });
  }, []);

  // Then try to fetch the audio
  useEffect(() => {
    if (summary && (summary.paper_id || summary.task_id)) {
      setIsLoading(true);
      // Try different possible IDs
      const possibleIds = [
        summary.summary_id,
        summary.paper_id,
        summary.task_id,
        // If the summary object has a result field with a summary_id
        summary.result?.summary_id
      ].filter(Boolean); // Remove undefined/null values
      
      console.log("Trying to fetch audio with these possible IDs:", possibleIds);
      
      // Try each ID
      const tryNextId = (index) => {
        if (index >= possibleIds.length) {
          setError('Audio not available for this summary');
          setIsLoading(false);
          return;
        }
        
        const id = possibleIds[index];
        console.log(`Attempting to fetch audio with ID: ${id}`);
        
        fetch(`http://localhost:8000/summaries/${id}/audio`)
          .then(response => {
            if (response.ok) {
              return response.blob();
            }
            throw new Error(`Failed with ID ${id}`);
          })
          .then(blob => {
            console.log(`Successfully fetched audio with ID: ${id}`);
            setAudioUrl(URL.createObjectURL(blob));
            setIsLoading(false);
          })
          .catch(err => {
            console.log(`Failed with ID ${id}, trying next ID`,err);
            tryNextId(index + 1);
          });
      };
      
      tryNextId(0);
    }
  }, [summary]);

  if (!summary) {
    return null;
  }

  return (
    <div className="summary-container">
      <h2>Paper Summary</h2>
      
      {/* <div className="debug-info" style={{backgroundColor: '#f8f8f8', padding: '10px', marginBottom: '15px', fontSize: '12px'}}>
        <p><strong>Debug Info (IDs):</strong></p>
        <p>Summary ID: {summary.summary_id || 'Not available'}</p>
        <p>Paper ID: {summary.paper_id || 'Not available'}</p>
        <p>Task ID: {summary.task_id || 'Not available'}</p>
        {summary.result && <p>Result Summary ID: {summary.result.summary_id || 'Not available'}</p>}
        <p>Available Summaries: {availableSummaries.length > 0 ? 
          availableSummaries.map(s => s.id || 'Unknown').join(', ') : 
          'No summaries available or endpoint not found'}</p>
      </div> */}
      
      
      <div className="summary-content">
        <div className="summary-section">
          <h3>Summary</h3>
          <p>{summary.summary}</p>
        </div>
      </div>

      <div className="audio-player-container">
        <h3>Audio Summary</h3>
        {isLoading ? (
          <p>Loading audio...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : audioUrl ? (
          <div className="audio-player">
            <audio 
              controls 
              src={audioUrl}
              className="audio-element"
              onError={() => setError("Error playing audio")}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p>No audio available for this summary</p>
        )}
      </div>
      
      {/* Summary content section */}
      <div className="summary-content">
        {/* ... existing code ... */}
      </div>
    </div>
  );
}

export default Summary;