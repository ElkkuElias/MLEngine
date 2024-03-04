import React, { useState } from 'react';
import './button.css';

const SurveyComponent = () => {
  // Questions array
  const questions = [
    'I am fascinated by 3D animation and visualization.',
    'I have a strong interest in vehicle technology and automotive engineering.',
    'I am keen on developing and working with assistive technology devices.',
    'I am interested in Chemistry and biotechnology.',
    'Conducting laboratory tests and analyses excites me.',
    'I have a talent for digital design and enjoy using technology to create art.',
    'Electronics and circuit design are areas where I excel.',
    'I am passionate about sustainability and environmental technology.',
    'Emergency medical care and first response are careers I can see myself in.',
    'I am skilled in physical therapy and enjoy helping others improve their mobility.',
    'Working in the performing arts and theater technology is my dream.',
    'I see myself as a future professional in the field of gerontology, focusing on elderly care.',
    'Information technology and software development are careers I aspire to.',
    'I am interested in international business and logistics.',
    'My goal is to work in the construction and architecture industry.',
    'I prefer a career that allows me to be creative and innovative in my work.',
    'Working in a lab and conducting experiments is where I see myself thriving.',
    'I am inclined towards careers that involve direct patient care and health services.',
    'A profession in the social services, helping communities and individuals, is important to me.',
    'Technology and engineering fields, especially those focused on electronics or automation, are where I want to be.',
    'I prefer hands-on learning experiences and practical applications over theoretical studies.',
    'Participating in projects and teamwork is an essential part of my ideal learning environment.',
    'I value opportunities for internships and industry placements as part of my education.',
    'Distance learning and flexible study options are important to me.',
    'I am interested in pursuing studies that offer a blend of artistic creativity and technological innovation.'
  ];

  // State to hold answers, initialized with null for each question
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  // Function to handle button click
  const handleAnswer = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };
  const getButtonStyle = (questionIndex, answer) => {
    return answers[questionIndex] === answer ? { backgroundColor: '#367B35' } : {}; // Darker green when selected
  };
  // Function to generate the JSON data
  const generateDataJSON = () => {
    const data = {
      data: answers,
    };
    console.log(data); 
    fetch('http://127.0.0.1:5000/predict', {  //based on ml model server
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
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question}</p>
          <div>
            {[1, 2, 3, 4, 5].map((answer) => (
              <button key={answer} onClick={() => handleAnswer(index, answer)} style={getButtonStyle(index,answer)}>
                {answer}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={generateDataJSON}>Submit Answers</button>
    </div>
  );
};

export default SurveyComponent;