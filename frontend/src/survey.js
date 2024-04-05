import React, { useState, useEffect } from 'react';
import './button.css';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

import global_en from './translations/en/global.json';
import global_su from './translations/su/global.json';
import global_tel from './translations/tel/global.json';
import Dropdown from './components/dropdown.js';


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

const SurveyComponent = () => {
  const { t } = useTranslation('global'); // Specify the namespace
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng); // Update localStorage with the new language
  };
  

  const questions = Object.keys(global_en); // Extract question keys from global_en JSON

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleAnswer = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const getButtonStyle = (questionIndex, answer) => {
    return answers[questionIndex] === answer ? { backgroundColor: '#367B35' } : {};
  };
  const getFontSize = () => {
    return selectedLanguage === 'tel' ? '0.8em' : '1em';
  };

  const generateDataJSON = () => {
    const data = {
      data: answers,
      userID: sessionStorage.getItem('userID'),
      lang: selectedLanguage
    };
    console.log(data);
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div style={{ fontSize: getFontSize() }}>
           <Dropdown onLanguageSelect={changeLanguage} />
      {questions.map((question, index) => (
        <div key={index}>
          <p>{t(`global:${question}`)}</p> {/* Translate each question key */}
          <div>
            {[1, 2, 3, 4, 5].map((answer) => (
              <button key={answer} onClick={() => handleAnswer(index, answer)} style={getButtonStyle(index, answer)}>
                {answer}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={generateDataJSON}>{t(`Submit answers`)}</button>
    </div>
  );
};

export default SurveyComponent;
