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
      en: { global: global_en },
      su: { global: global_su },
      tel: { global: global_tel }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const SurveyComponent = () => {
  const { t } = useTranslation('global');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
  };
  
  
  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const data = {
      answers: answers,
      userID: sessionStorage.getItem('userID'),
      lang: selectedLanguage
    };
  
    console.log('Submitting Answers:', data);
  
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('Submission Response:', responseData);
        // Handle any further processing or UI updates based on the response
      })
      .catch(error => {
        console.error('Submission Error:', error);
        // Handle errors, such as displaying an error message to the user
      });
  };

  const getButtonStyle = (answer) => {
    return answers[currentQuestionIndex] === answer ? { backgroundColor: '#367B35' } : {};
  };

  const getFontSize = () => {
    return selectedLanguage === 'tel' ? '0.8em' : '1em';
  };

  const questions = Object.keys(global_en);

  return (
    <div style={{ fontSize: getFontSize() }}>
      <Dropdown onLanguageSelect={changeLanguage} />
      <div key={currentQuestionIndex}>
        <p>{t(`global:${questions[currentQuestionIndex]}`)}</p>
        <div>
          {[1, 2, 3, 4, 5].map((answer) => (
            <button key={answer} onClick={() => handleAnswer(answer)} style={getButtonStyle(answer)} className="survey-button">
              {answer}
            </button>
          ))}
        </div>
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion} className="survey-button">{t('Back')}</button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <button onClick={handleSubmit} className="survey-button">{t('Submit answers')}</button>
        )}
      </div>
    </div>
  );
};

export default SurveyComponent;
