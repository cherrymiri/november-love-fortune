import React from 'react';

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

export function RetryIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M16 10a6 6 0 1 1-1.8-4.3" />
      <path d="M16 3.5v3.2h-3.2" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 12.5V3M6.5 6.5L10 3l3.5 3.5" />
      <path d="M4 11v5h12v-5" />
    </svg>
  );
}

export function Emphasis({ text }) {
  return (
    <span className="em">
      <span className="br br-l" aria-hidden="true">[</span>
      {text}
      <span className="br br-r" aria-hidden="true">]</span>
    </span>
  );
}
