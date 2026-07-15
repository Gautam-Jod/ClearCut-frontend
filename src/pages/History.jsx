import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageCard from '../components/ImageCard';
import { PageLoader } from '../components/LoadingSpinner';
import { imageService } from '../services/api';
import './History.css';

export default function History() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    imageService.getAll()
      .then((res) => setImages(res.data.data))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (deletedId) => {
    setImages((prev) => prev.filter((img) => img._id !== deletedId));
  };

  const filtered = images
    .filter((img) =>
      img.originalName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'largest') return b.originalSize - a.originalSize;
      return 0;
    });

  if (loading) return <PageLoader />;

  return (
    <main className="page">
      <div className="container">

        {/* Header */}
        <div className="history-header page-header">
          <div>
            <h1 className="page-title">History</h1>
            <p className="page-subtitle">
              {images.length > 0
                ? `${images.length} image${images.length !== 1 ? 's' : ''} processed`
                : 'No images yet'}
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary" id="new-upload-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Upload
          </Link>
        </div>

        {/* Controls */}
        {images.length > 0 && (
          <div className="history-controls">
            <div className="history-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="history-search__input"
                id="history-search-input"
              />
              {search && (
                <button className="history-search__clear" onClick={() => setSearch('')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            <select
              className="history-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              id="history-sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="largest">Largest File</option>
            </select>
          </div>
        )}

        {/* Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="history-empty animate-fade-in-up">
            <div className="history-empty__icon">
              {search ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="4"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </div>
            <h3 className="history-empty__title">
              {search ? 'No results found' : 'No images yet'}
            </h3>
            <p className="history-empty__desc">
              {search
                ? `No images match "${search}". Try a different search.`
                : 'Upload your first image to get started. Results will appear here.'}
            </p>
            {!search && (
              <Link to="/upload" className="btn btn-primary" id="empty-upload-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Your First Image
              </Link>
            )}
          </div>
        ) : (
          <div className="history-grid">
            {filtered.map((image, i) => (
              <div
                key={image._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s`, animationFillMode: 'both', opacity: 0 }}
              >
                <ImageCard image={image} onDeleted={handleDeleted} />
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
