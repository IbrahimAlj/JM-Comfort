import { useRef, useState } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialImages = [
  { id: 1, url: '/gallery1.jpg', name: 'Gallery Image 1' },
  { id: 2, url: '/gallery2.jpg', name: 'Gallery Image 2' },
];

export function validateFile(file) {
  if (!file) {
    return 'Please select a file.';
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, and WEBP files are allowed.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File must be 5MB or smaller.';
  }

  return '';
}

export default function AdminUpload() {
  const [images, setImages] = useState(initialImages);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetFeedback = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleValidatedFile = (file) => {
    resetFeedback();

    const validationError = validateFile(file);
    if (validationError) {
      setSelectedFile(null);
      setErrorMessage(validationError);
      return;
    }

    setSelectedFile(file);
    setSuccessMessage(`${file.name} is ready to upload.`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleValidatedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleValidatedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = () => {
    resetFeedback();

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setUploadProgress(25);

    setTimeout(() => {
      setUploadProgress(100);

      const newImage = {
        id: Date.now(),
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
      };

      setImages((prev) => [...prev, newImage]);
      setSuccessMessage('Upload completed successfully.');
      setSelectedFile(null);
      setUploadProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 600);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    setImages((prev) => prev.filter((image) => image.id !== id));
    setSuccessMessage('Image deleted successfully.');
    setErrorMessage('');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Admin Gallery Management</h1>

      {(successMessage || errorMessage) && (
        <div
          role="alert"
          style={{
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: errorMessage ? '#fee2e2' : '#dcfce7',
            color: errorMessage ? '#991b1b' : '#166534',
          }}
        >
          {errorMessage || successMessage}
        </div>
      )}

      <section style={{ marginBottom: '32px' }}>
        <h2>Upload New Image</h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-testid="drop-zone"
          style={{
            border: `2px dashed ${isDragging ? '#000000' : '#9ca3af'}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            backgroundColor: isDragging ? '#f9fafb' : 'white',
            textAlign: 'center',
          }}
        >
          <p>Drag and drop an image here or choose a file.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            data-testid="file-input"
          />
        </div>

        <button onClick={handleUpload}>Upload Image</button>

        {uploadProgress > 0 && (
          <p data-testid="upload-progress">Upload Progress: {uploadProgress}%</p>
        )}
      </section>

      <section>
        <h2>Current Gallery Images</h2>

        <div
          data-testid="gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
                backgroundColor: 'white',
              }}
            >
              <img
                src={image.url}
                alt={image.name}
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              />

              <p>{image.name}</p>

              <button onClick={() => handleDelete(image.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}