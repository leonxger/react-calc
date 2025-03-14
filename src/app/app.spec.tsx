import { render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have "React Calculator" as the title', () => {
    render(<App />);
    const titleElement = screen.getByText('React Calculator');
    expect(titleElement).toBeTruthy();
  });

  it('should render the theme selector', () => {
    render(<App />);
    const themeSelector = screen.getByLabelText('Select theme');
    expect(themeSelector).toBeTruthy();
  });

  it('should render the calculator component', () => {
    render(<App />);
    const calculator = screen.getByTestId('calculator');
    expect(calculator).toBeTruthy();
  });
});
