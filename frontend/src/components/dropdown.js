import React, { useState } from 'react';

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
];

const Dropdown = ({ onLanguageSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Track the selected language

  // Adjust font size for the "Telugu" language
  const getFontSize = (languageCode) => {
    return languageCode === 'tel' ? '16px' : '16px';
  };

  return (
    <div className="dropdown" style={{ ...styles.dropdown, fontSize: getFontSize(selectedLanguage) }}>
      <button
        className="dropdown-toggle"
        onClick={() => setIsVisible(!isVisible)}
        style={styles.toggleButton}
      >
        {languages.find(lang => lang.code === selectedLanguage)?.name || 'Select Language'}
      </button>

      {isVisible && (
        <ul className="dropdown-menu" style={styles.dropdownMenu}>
          {languages.map((language) => (
            <li key={language.code} style={styles.menuItem}>
              <button
                className="dropdown-button"
                onClick={() => {
                  onLanguageSelect(language.code);
                  setSelectedLanguage(language.code); // Update the selected language
                  setIsVisible(false);
                }}
                style={styles.button}
              >
                {language.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Styles (same as before, without fontSize in dropdown)
const styles = {
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  toggleButton: {
    backgroundColor: '#4CAF50', // Green background
    color: 'white',
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  dropdownMenu: {
    display: 'block',
    position: 'absolute',
    backgroundColor: '#f9f9f9', // Light-grey background
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  menuItem: {
    color: 'black',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
  },
  button: {
    background: 'none',
    color: 'inherit',
    border: 'none',
    padding: '0',
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
  }
};

export default Dropdown;
