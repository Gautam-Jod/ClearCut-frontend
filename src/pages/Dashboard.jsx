import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { imageService } from '../services/api';
import { PageLoader } from '../components/LoadingSpinner';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

function AnimatedNumber({ target, duration = 1500 }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{value.toLocaleString()}</span>;
}

function formatTime(ms) {
  if (!ms) return '0s';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatSize(bytes) {
  if (!bytes) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    imageService.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats({ totalProcessed: 0, avgProcessingTime: 0, totalOriginalSize: 0, recentImages: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const statCards = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
      label: 'Images Processed',
      value: <AnimatedNumber target={stats.totalProcessed} />,
      suffix: '',
      color: 'violet',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: 'Avg. Processing Time',
      value: formatTime(stats.avgProcessingTime),
      isString: true,
      color: 'indigo',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
      label: 'Total Data Processed',
      value: formatSize(stats.totalOriginalSize),
      isString: true,
      color: 'emerald',
    },
  ];

  return (
    <main className="page">
      <div className="container">

        {/* Hero */}
        <section className="dashboard-hero animate-fade-in-up">
          <div className="dashboard-hero__badge badge badge-violet">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            AI-Powered Background Removal
          </div>
          <h1 className="dashboard-hero__title">
            Remove Backgrounds<br />
            <span className="gradient-text">Instantly with AI</span>
          </h1>
          <p className="dashboard-hero__subtitle">
            Upload any image and our AI removes the background in seconds.
            Professional results for e-commerce, design, and marketing.
          </p>
          <div className="dashboard-hero__actions">
            <Link to="/upload" className="btn btn-primary btn-lg" id="get-started-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Start Removing Backgrounds
            </Link>
            <Link to="/history" className="btn btn-secondary btn-lg" id="view-history-btn">
              View History
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="dashboard-stats stagger-children">
          {statCards.map(({ icon, label, value, isString, color }) => (
            <div key={label} className={`stat-card card stat-card--${color} animate-fade-in-up`}>
              <div className={`stat-card__icon stat-card__icon--${color}`}>{icon}</div>
              <div className="stat-card__body">
                <div className="stat-card__value">
                  {isString ? value : value}
                </div>
                <div className="stat-card__label">{label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            {[
              {
                num: '01',
                title: 'Upload Your Image',
                desc: 'Drag & drop or click to select any JPG, PNG, or WEBP file up to 12MB.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                ),
              },
              {
                num: '02',
                title: 'AI Processes It',
                desc: 'Our remove.bg integration detects and removes the background with precision.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Compare & Download',
                desc: 'Use the before/after slider, then download your result as PNG or JPG.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ),
              },
            ].map(({ num, title, desc, icon }) => (
              <div key={num} className="how-step card">
                <div className="how-step__num">{num}</div>
                <div className="how-step__icon">{icon}</div>
                <h3 className="how-step__title">{title}</h3>
                <p className="how-step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Images */}
        {stats.recentImages?.length > 0 && (
          <section className="recent-section">
            <div className="recent-section__header">
              <h2 className="section-title">Recent Results</h2>
              <Link to="/history" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div className="recent-grid">
              {stats.recentImages.map((img) => (
                <Link key={img._id} to={`/result/${img._id}`} className="recent-card">
                  <div className="recent-card__thumb">
                    <img
                      src={`${API_BASE_URL}/uploads/${img.processedPath}`}
                      alt={img.originalName}
                      loading="lazy"
                    />
                  </div>
                  <span className="recent-card__name">{img.originalName}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
