// src/App.tsx
import React from 'react';
import VideoChat from './components/VideoChat';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>Clurb WashU</h1>
        <p>In the Clurb, we all Bears!</p>
      </header>
      <main className="main-content">
        <VideoChat />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Clurb WashU</p>
        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/safety">Safety Tips</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
