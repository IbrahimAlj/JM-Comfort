import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminUpload, { validateFile } from '../pages/AdminUpload';

describe('AdminUpload validation', () => {
  test('rejects gif files', () => {
    const gifFile = new File(['gif'], 'bad.gif', { type: 'image/gif' });
    expect(validateFile(gifFile)).toBe('Only JPG, PNG, and WEBP files are allowed.');
  });

  test('accepts jpg files', () => {
    const jpgFile = new File(['jpg'], 'good.jpg', { type: 'image/jpeg' });
    expect(validateFile(jpgFile)).toBe('');
  });

  test('rejects files larger than 5MB', () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    Object.defineProperty(largeFile, 'size', {
      value: 6 * 1024 * 1024,
    });

    expect(validateFile(largeFile)).toBe('File must be 5MB or smaller.');
  });
});

describe('AdminUpload component', () => {
  beforeEach(() => {
    window.confirm = jest.fn(() => true);
  });

  test('renders upload form', () => {
    render(<AdminUpload />);
    expect(screen.getByText('Upload New Image')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
  });

  test('renders delete button for each image', () => {
    render(<AdminUpload />);
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  test('shows validation error for gif upload', () => {
    render(<AdminUpload />);

    const input = screen.getByTestId('file-input');
    const gifFile = new File(['gif'], 'bad.gif', { type: 'image/gif' });

    fireEvent.change(input, { target: { files: [gifFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Only JPG, PNG, and WEBP files are allowed.'
    );
  });
});