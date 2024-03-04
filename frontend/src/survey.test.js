import React from 'react';
import { render,screen,fireEvent } from '@testing-library/react';
import SurveyComponent from './survey.js';

test('renders without crashing and displays the correct number of questions and buttons', () => {
    const { container } = render(<SurveyComponent />);
    const questionElements = Array.from(container.querySelectorAll('p')) 
                                  .filter(p => p.textContent.trim().endsWith('.')); //selects text that end in .
  
    expect(questionElements.length).toBe(25); //25 questions in total
  
    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(25 * 5 + 1);  //5 buttons for each question

  });

  test('button click updates style to indicate selection', () => {
    const { getAllByRole } = render(<SurveyComponent />);
    const firstQuestionButtons = getAllByRole('button').slice(0, 5); // Buttons for the first question
    fireEvent.click(firstQuestionButtons[0]); // Click the first button of the first question
  
    expect(firstQuestionButtons[0]).toHaveStyle('backgroundColor: #367B35'); // Check if the button style is updated
  });
  test('submit button sends correct data', () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({ success: true })
    }));
  
    const { getByText, getAllByRole } = render(<SurveyComponent />);
    const firstQuestionButtons = getAllByRole('button').slice(0, 5);
    fireEvent.click(firstQuestionButtons[2]); // Select the 3rd option for the first question
  
    const submitButton = getByText('Submit Answers');
    fireEvent.click(submitButton);
  
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/predict', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [3, ...Array(24).fill(null)]}) // The first answer is 3, the rest are null
    }));
  
    global.fetch.mockRestore();
  });
  
  

  

  
  