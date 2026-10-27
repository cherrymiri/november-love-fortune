import React, { forwardRef } from 'react';

export const CardBack = forwardRef(function CardBack({ dot = 'b', className = '', style }, ref) {
  return (
    <div ref={ref} className={`card card--back ${className}`} style={style} aria-hidden="true">
      <div className="card-sheen" />
      <div className="card-frame" />
      <div className={`card-dot dot-${dot}`} />
    </div>
  );
});

export const CardFront = forwardRef(function CardFront({ love, className = '', style, hidden }, ref) {
  return (
    <div
      ref={ref}
      className={`card card--front ${className}`}
      style={style}
      role={hidden ? undefined : 'img'}
      aria-hidden={hidden ? 'true' : undefined}
      aria-label={hidden ? undefined : `뒤집힌 카드 앞면: ${love.en} ${love.ko}`}
    >
      <div className="card-rings" />
      <div className="card-sheen" />
      <div className="card-frame" />
      <span className="card-no">{love.no}</span>
      <div className="card-dot" />
      <div className="card-name">
        <span className="card-en">{love.en}</span>
        <span className="card-ko">{love.ko}</span>
      </div>
    </div>
  );
});
