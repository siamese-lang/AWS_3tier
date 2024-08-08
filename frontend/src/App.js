import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayoutPreview from './components/AppLayoutPreview';
import EntryPage from './components/EntryPage';
import './styles/login.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<EntryPage />} />
        <Route path="/home" element={<AppLayoutPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
