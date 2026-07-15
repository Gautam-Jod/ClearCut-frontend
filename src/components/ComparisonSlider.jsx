import { useState, useRef, useCallback, useEffect } from 'react';
import './ComparisonSlider.css';

export default function ComparisonSlider({ originalSrc, processedSrc }) {
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => { e.preventDefault(); setIsDragging(true); };
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = useCallback((e) => { if (isDragging) updateSlider(e.clientX); }, [isDragging, updateSlider]);

  const onTouchStart = (e) => { setIsDragging(true); };
  const onTouchEnd = () => setIsDragging(false);
  const onTouchMove = useCallback((e) => {
    if (isDragging) updateSlider(e.touches[0].clientX);
  }, [isDragging, updateSlider]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, onMouseMove, onTouchMove]);

  return (
    <div className="comparison animate-scale-in">
      {/* Labels */}
      <div className="comparison__label comparison__label--before">
        <span>Original</span>
      </div>
      <div className="comparison__label comparison__label--after">
        <span>Background Removed</span>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className={`comparison__container ${isDragging ? 'comparison__container--dragging' : ''}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Before (original) — full width, underneath */}
        <img
          src={originalSrc}
          alt="Original"
          className="comparison__img comparison__img--before"
          draggable={false}
        />

        {/* After (processed) — clipped from left */}
        <div
          className="comparison__after-wrap"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={processedSrc}
            alt="Background Removed"
            className="comparison__img comparison__img--after"
            draggable={false}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="comparison__handle"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <div className="comparison__line" />
          <div className="comparison__knob">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="comparison__line" />
        </div>
      </div>

      <p className="comparison__hint">← Drag handle to compare →</p>
    </div>
  );
}
