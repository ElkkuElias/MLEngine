import React, { useState } from 'react';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

const languages = [
    {
      code: 'en',
      name: 'English'
  
    },
    {
      code: "su",
      name: "Finnish"
    },
    {
      code: "tel",
      name: "Telugu"
    }
  ]
  const Dropdown = ({ onLanguageSelect }) => {
    return (
      <ul className='dropdown-menu'>
        {languages.map((language) => (
          <li key={language.code}>
            <button
              className='dropdown-button'
              onClick={() => onLanguageSelect(language.code)}
            >
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default Dropdown;