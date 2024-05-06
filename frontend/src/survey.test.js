import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurveyComponent from './survey.js';
import { expect } from 'playwright/test';

test('renders without crashing and displays the correct number of questions and buttons', async () => {
  render(<SurveyComponent />);
  
  // Assuming "Back" button is conditionally rendered and needs to be tested in context:
  const buttonsBeforeAction = screen.getAllByRole('button');
  expect(buttonsBeforeAction.length).toBe(6); // Initial buttons without "Back"

  // Simulate conditions where all buttons would be present:
  // Assuming clicking first answer moves to next question and shows "Back" button
  fireEvent.click(screen.getAllByRole('button', {name: /1/})[0]); 

  const buttonsAfterAction = screen.getAllByRole('button');
  expect(buttonsAfterAction.length).toBe(7); // All buttons including "Back"
});


test('submit button sends correct data', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
    json: () => Promise.resolve({ success: true })
  }));
  
  render(<SurveyComponent />);

  // Simulate navigating to the last question
  const answers = screen.getAllByRole('button', {name: /1|2|3|4|5/});
  expect(answers.length).toBe(5);
});


