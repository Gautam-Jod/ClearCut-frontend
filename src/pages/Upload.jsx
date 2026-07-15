import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DropZone from '../components/DropZone';
import { ProcessingSteps } from '../components/LoadingSpinner';
import { imageService } from '../services/api';
import './Upload.css';

const STEPS = [
  'Preparing your image',
  'Uploading to server',
  'AI removing background',
  'Finalizing result',
];

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setError('');
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError('');
    setCurrentStep(0);

    // Simulate step progression
    const stepTimer = (step, delay) =>
      new Promise((r) => setTimeout(() => { setCurrentStep(step); r(); }, delay));

    try {
      await stepTimer(1, 600);

      const res = await imageService.upload(selectedFile, (e) => {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(pct);
        if (pct >= 100) setCurrentStep(2);
      });

      await stepTimer(3, 400);

      navigate(`/result/${res.data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
      setProcessing(false);
      setCurrentStep(-1);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div className="upload-layout">

          {/* Left — Form */}
          <div className="upload-form animate-fade-in-up">
            <div className="page-header">
              <h1 className="page-title">Upload Image</h1>
              <p className="page-subtitle">
                Drag & drop your image or click to browse. Supported: JPG, PNG, WEBP · Max 12MB.
              </p>
            </div>

            <DropZone onFileSelect={handleFileSelect} />

            {error && (
              <div className="upload-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <button
              id="remove-bg-btn"
              className="btn btn-primary btn-lg upload-submit"
              onClick={handleSubmit}
              disabled={!selectedFile || processing}
            >
              {processing ? (
                <>
                  <div className="upload-submit__spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Remove Background
                </>
              )}
            </button>
          </div>

          {/* Right — Progress / Info */}
          <div className="upload-sidebar">
            {processing ? (
              <div className="upload-progress card animate-scale-in">
                <div className="upload-progress__title">
                  <div className="upload-progress__dot" />
                  Processing your image...
                </div>
                <ProcessingSteps steps={STEPS} currentStep={currentStep} />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-progress__bar-wrap">
                    <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
                    <span>{uploadProgress}%</span>
                  </div>
                )}
                <p className="upload-progress__note">
                  AI processing usually takes 5–15 seconds depending on image complexity.
                </p>
              </div>
            ) : (
              <div className="upload-tips card">
                <h3 className="upload-tips__title">Tips for best results</h3>
                <ul className="upload-tips__list">
                  {[
                    'Use images with clear subject definition',
                    'Higher resolution gives cleaner edges',
                    'Works best on portraits, products & objects',
                    'Avoid extremely complex backgrounds',
                  ].map((tip) => (
                    <li key={tip} className="upload-tips__item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>

                <div className="upload-tips__divider" />

                <div className="upload-tips__formats">
                  <h4>Supported Formats</h4>
                  <div className="upload-tips__format-list">
                    {['JPG', 'PNG', 'WEBP'].map((f) => (
                      <span key={f} className="badge badge-violet">{f}</span>
                    ))}
                  </div>
                  <p className="upload-tips__limit">Max file size: 12 MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
