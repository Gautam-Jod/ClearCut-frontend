import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageService } from '../services/api';
import './ImageCard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCard({ image, onDeleted }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await imageService.delete(image._id);
      onDeleted(image._id);
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="image-card animate-fade-in-up card">
        {/* Thumbnail */}
        <div
          className="image-card__thumb"
          onClick={() => navigate(`/result/${image._id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/result/${image._id}`)}
        >
          <img
            src={`${API_BASE_URL}/uploads/${image.processedPath}`}
            alt={image.originalName}
            className="image-card__img"
            loading="lazy"
          />

          <div className="image-card__overlay">
            <span className="image-card__view-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Result
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="image-card__body">
          <div className="image-card__meta">
            <span className="image-card__name" title={image.originalName}>
              {image.originalName}
            </span>
            <span className="image-card__date">{formatDate(image.createdAt)}</span>
          </div>

          <div className="image-card__stats">
            <span title="Processed size">{formatSize(image.processedSize)}</span>
            {image.width > 0 && (
              <span title="Dimensions">
                {image.width}×{image.height}
              </span>
            )}
            {image.processingTime > 0 && (
              <span title="Processing time">
                {(image.processingTime / 1000).toFixed(1)}s
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="image-card__actions">
            <a
              href={imageService.getDownloadUrl(image._id, 'png')}
              download
              className="btn btn-secondary btn-sm"
              title="Download PNG"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PNG
            </a>

            <a
              href={imageService.getDownloadUrl(image._id, 'jpg')}
              download
              className="btn btn-secondary btn-sm"
              title="Download JPG"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              JPG
            </a>

            <button
              className="btn btn-danger btn-sm image-card__delete"
              onClick={() => setShowConfirm(true)}
              title="Delete"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Delete this image?</div>

            <div className="modal-body">
              <strong style={{ color: 'var(--text-primary)' }}>
                {image.originalName}
              </strong>{' '}
              will be permanently deleted from history and your storage. This action cannot be undone.
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}