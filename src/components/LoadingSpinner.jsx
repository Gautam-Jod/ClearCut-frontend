import './LoadingSpinner.css';

export function LoadingSpinner({ size = 40, label = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" style={{ width: size, height: size }} />
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
}

export function ProcessingSteps({ steps, currentStep }) {
  return (
    <div className="processing-steps">
      {steps.map((step, i) => {
        const isDone    = i < currentStep;
        const isActive  = i === currentStep;
        return (
          <div
            key={step}
            className={`step ${isDone ? 'step--done' : ''} ${isActive ? 'step--active' : ''}`}
          >
            <div className="step__icon">
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : isActive ? (
                <div className="step__spinner" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="step__label">{step}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__inner">
        <div className="spinner spinner--lg" />
      </div>
    </div>
  );
}
