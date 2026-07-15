import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ComparisonSlider from '../components/ComparisonSlider';
import { PageLoader } from '../components/LoadingSpinner';
import { imageService } from '../services/api';
import './Result.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    imageService.getById(id)
      .then((res) => setImage(res.data.data))
      .catch(() => setError('Image not found or has been deleted.'))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDownload = (format) => {
    const url = imageService.getDownloadUrl(id, format);
    const a = document.createElement('a');
    a.href = url;
    a.click();
    showToast(`Downloading ${format.toUpperCase()}...`);
  };

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <main className="page">
        <div className="container">
          <div className="result-error card">
            <div className="result-error__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <Link to="/history" className="btn btn-primary">Go to History</Link>
          </div>
        </div>
      </main>
    );
  }

  const originalSrc = `/uploads/${image.originalPath}`;
  const processedSrc = `/uploads/${image.processedPath}`;

  return (
    <main className="page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="result-breadcrumb">
          <Link to="/">Dashboard</Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span>Result</span>
        </nav>

        <div className="result-layout">

          {/* Comparison Slider */}
          <div className="result-main animate-fade-in-up">
            <ComparisonSlider originalSrc={originalSrc} processedSrc={processedSrc} />
          </div>

          {/* Sidebar */}
          <div className="result-sidebar animate-fade-in-up">

            {/* File Info */}
            <div className="result-info card">
              <h2 className="result-info__title">{image.originalName}</h2>
              <span className="badge badge-success">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Background Removed
              </span>

              <div className="result-meta">
                {[
                  { label: 'Dimensions', value: image.width && image.height ? `${image.width} × ${image.height} px` : '—' },
                  { label: 'Original Size', value: formatSize(image.originalSize) },
                  { label: 'Processed Size', value: formatSize(image.processedSize) },
                  { label: 'Processing Time', value: image.processingTime ? `${(image.processingTime / 1000).toFixed(1)}s` : '—' },
                  { label: 'Date', value: formatDate(image.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="result-meta__row">
                    <span className="result-meta__label">{label}</span>
                    <span className="result-meta__value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download */}
            <div className="result-downloads card">
              <h3 className="result-downloads__title">Download</h3>
              <p className="result-downloads__subtitle">Choose your preferred format</p>

              <button
                id="download-png-btn"
                className="btn btn-primary result-downloads__btn"
                onClick={() => handleDownload('png')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PNG
                <span className="result-downloads__badge">Transparent</span>
              </button>

              <button
                id="download-jpg-btn"
                className="btn btn-secondary result-downloads__btn"
                onClick={() => handleDownload('jpg')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download JPG
                <span className="result-downloads__badge result-downloads__badge--secondary">White BG</span>
              </button>
            </div>

            {/* Actions */}
            <div className="result-actions">
              <Link to="/upload" className="btn btn-secondary" id="remove-another-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Remove Another
              </Link>
              <Link to="/history" className="btn btn-secondary" id="view-history-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
                </svg>
                History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast toast-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}
