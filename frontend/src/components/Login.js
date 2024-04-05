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

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation('global'); // Specify the namespace
  const [selectedLanguage, setSelectedLanguage] = useState('su');
  let navigate = useNavigate();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng); // Update localStorage with the new language
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
        email: email,
        password: password,
        //suffix: `${selectedLanguage}`
      };
    
    
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('userID', data.userID);
        console.log(data);
        navigate('/survey')
    })
      .catch((error) => {
        console.error('Error:', error);
      });
    };

  return (
    <div>
      <Dropdown onLanguageSelect={changeLanguage}/>
    <form onSubmit={handleSubmit}>
      <label>
      {t('Email')}
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
      {t('Password')}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
    <button onClick={() => window.location.href = '/'}>{t('Register')}</button>
    </div>
  );
};

export default LoginForm;