import React from 'react';
import './TaskTracker.css';

function TaskTracker({ taskId, loading, error }) {
  return (
    <div className="task-tracker">
      <h2>Processing Paper</h2>
      
      {error ? (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="status">
          <p>Task ID: {taskId}</p>
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing your paper. This may take a few minutes...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskTracker;