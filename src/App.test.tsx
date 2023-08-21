import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Chord Transposer', () => {
  render(<App />);
  const header = screen.getByText(/Chord Transposer/i);
  expect(header).toBeInTheDocument();
});
