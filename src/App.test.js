import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MF.CO brand mark', () => {
  render(<App />);
  const brandElement = screen.getByText(/MF\.CO/i);
  expect(brandElement).toBeInTheDocument();
});
