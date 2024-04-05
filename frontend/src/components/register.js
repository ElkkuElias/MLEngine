
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

import global_en from '../translations/en/global.json';
import global_su from '../translations/su/global.json';
import global_tel from '../translations/tel/global.json';
import Dropdown from './dropdown';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en : { global: global_en },
      su : { global: global_su },
      tel : { global: global_tel }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const RegistrationForm = () => {
  const { t } = useTranslation('global'); // Specify the namespace
  const [selectedLanguage, setSelectedLanguage] = useState('su');
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
  };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();
  const handleLogin = (event) => {
    navigate('/login');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    
    const suffix = `${selectedLanguage}`
    const userData = {
      [`firstName_${suffix}`]: firstName, 
      [`lastName_${suffix}`]: lastName,
      email,
      password,
      suffix
    };

    console.log(userData)
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem('userID', data.userID);
        navigate('/survey'); // Navigate after successful registration
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    
    <div>
      <Dropdown onLanguageSelect={changeLanguage}/>
      <h2>{t('Registration')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('First Name')}:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>{t('Last Name')}:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>{t('Email')}:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>{t('Password')}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
        <button type="submit">{t('Register')}</button>
        
      </form>
      <button onClick={handleLogin}>{t('Login')}</button>
    </div>
  );
};

export default RegistrationForm;
