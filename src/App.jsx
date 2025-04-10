// App.jsx - Main application
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import UploadForm from './components/UploadForm';
import UrlForm from './components/UrlForm';
import DoiForm from './components/DoiForm';
import Summary from './components/Summary';
import TaskTracker from './components/TaskTracker';
import SearchResults from './components/SearchResults';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [taskId, setTaskId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check task status when taskId changes
  useEffect(() => {
    let intervalId;
    
    if (taskId) {
      setLoading(true);
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
          if (!response.ok) throw new Error('Failed to fetch task status');
          
          const data = await response.json();
          
          if (data.status === 'completed' && data.result) {
            clearInterval(intervalId);
            setSummary(data.result);
            setLoading(false);
          } else if (data.status === 'failed') {
            clearInterval(intervalId);
            setError(data.message || 'Task failed');
            setLoading(false);
          }
        } catch (err) {
          clearInterval(intervalId);
          setError(err.message);
          setLoading(false);
        }
      }, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId]);

  const handleTaskCreated = (newTaskId) => {
    setTaskId(newTaskId);
    setSummary(null);
    setError(null);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setActiveTab('results');
  };

  const handlePaperSelect = (paper) => {
    // Process the selected paper (by URL or DOI)
    setActiveTab('processing');
    processPaper(paper);
  };

  const processPaper = async (paper) => {
    try {
      setLoading(true);
      const endpoint = paper.doi ? '/papers/doi' : '/papers/url';
      const payload = paper.doi 
        ? { doi: paper.doi, topic_list: [] } 
        : { url: paper.url, topic_list: [] };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to process paper');
      
      const data = await response.json();
      handleTaskCreated(data.task_id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Research Paper Summarization System</h1>
      </header>
      
      <nav className="tabs">
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button 
          className={activeTab === 'upload' ? 'active' : ''} 
          onClick={() => setActiveTab('upload')}
        >
          Upload PDF
        </button>
        <button 
          className={activeTab === 'url' ? 'active' : ''} 
          onClick={() => setActiveTab('url')}
        >
          Process URL
        </button>
        <button 
          className={activeTab === 'doi' ? 'active' : ''} 
          onClick={() => setActiveTab('doi')}
        >
          Process DOI
        </button>
      </nav>
      
      <main>
        {activeTab === 'search' && (
          <SearchForm onSearchResults={handleSearchResults} />
        )}
        
        {activeTab === 'results' && (
          <SearchResults 
            results={searchResults} 
            onSelect={handlePaperSelect} 
          />
        )}
        
        {activeTab === 'upload' && (
          <UploadForm onTaskCreated={handleTaskCreated} />
        )}
        
        {activeTab === 'url' && (
          <UrlForm onTaskCreated={handleTaskCreated} />
        )}
        
        {activeTab === 'doi' && (
          <DoiForm onTaskCreated={handleTaskCreated} />
        )}
        
        {activeTab === 'processing' && taskId && !summary && (
          <TaskTracker 
            taskId={taskId} 
            loading={loading} 
            error={error} 
          />
        )}
        
        {summary && (
          <Summary summary={summary} />
        )}
      </main>
    </div>
  );
}

export default App;