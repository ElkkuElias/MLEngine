import logo from './logo.svg';
import './App.css';
import React from 'react';
import SurveyComponent from './survey.js';
import RegistrationForm from './components/register.js';
import LoginForm from './components/Login.js';
import Dropdown from './components/dropdown.js';





function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        {/*<LoginForm />*/}
       {/* <RegistrationForm />*/}
        <SurveyComponent />
      
      </header>
    </div>
  );
}

export default App;

