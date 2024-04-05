import logo from './logo.svg';
import './App.css';
import React from 'react';
import SurveyComponent from './survey.js';
import RegistrationForm from './components/register.js';
import LoginForm from './components/Login.js';
import Dropdown from './components/dropdown.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/survey" element={<SurveyComponent />} />
            {/* You can add more routes here as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;