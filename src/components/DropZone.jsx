import { useState, useRef, useCallback } from 'react';
import './DropZone.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 12;

export default function DropZone({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or WEBP.';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onInputChange = (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); };

  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="dropzone-wrapper">
      {preview ? (
        <div className="dropzone-preview animate-scale-in">
          <img src={preview} alt="Preview" className="dropzone-preview__img" />
          <div className="dropzone-preview__overlay">
            <div className="dropzone-preview__info">
              <span className="dropzone-preview__name">{selectedFile?.name}</span>
              <span className="dropzone-preview__size">
                {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={clearSelection}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragging ? 'dropzone--dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={onInputChange}
            style={{ display: 'none' }}
            id="file-input"
          />

          <div className="dropzone__icon">
            {isDragging ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>

          <div className="dropzone__text">
            <p className="dropzone__heading">
              {isDragging ? 'Drop your image here!' : 'Drag & drop your image'}
            </p>
            <p className="dropzone__subtext">or click to browse files</p>
          </div>

          <div className="dropzone__formats">
            {['JPG', 'PNG', 'WEBP'].map((fmt) => (
              <span key={fmt} className="badge badge-violet">{fmt}</span>
            ))}
            <span className="dropzone__size-limit">Max 12 MB</span>
          </div>
        </div>
      )}

      {error && (
        <div className="dropzone-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
