import React, { useRef } from 'react';
import { CardFront } from './Card.jsx';
import { ArrowIcon, Emphasis } from './Icons.jsx';

export default function ResultScreen({ love, api, onNext, busy, arriving }) {
  const slotRef = useRef(null);
  const ghostRefs = useRef([]);
  const fadeRefs = useRef([]);
  const orbRef = useRef(null);
  const titleRef = useRef(null);
  const rootRef = useRef(null);

  api.current = { slot: slotRef, ghosts: ghostRefs, fades: fadeRefs, orb: orbRef, title: titleRef, root: rootRef };

  const setFade = (i) => (el) => (fadeRefs.current[i] = el);
  const pre = arriving ? 'reveal' : 'reveal is-in';

  return (
    <main className="screen result" ref={rootRef} aria-labelledby="result-title">
      <div className="bg-layer" aria-hidden="true"><div className="glow-bottom result-glow" /></div>
      <p className="topbar result-top">11월의 사랑 운세</p>

      <div className="result-visual">
        <div className="orb result-orb" ref={orbRef} style={arriving ? { opacity: 0 } : undefined} />
        <div className="card--ghost ghost-1" ref={(el) => (ghostRefs.current[0] = el)} style={arriving ? { opacity: 0 } : undefined} aria-hidden="true" />
        <div className="card--ghost ghost-2" ref={(el) => (ghostRefs.current[1] = el)} style={arriving ? { opacity: 0 } : undefined} aria-hidden="true" />
        <CardFront ref={slotRef} love={love} className="result-card" style={arriving ? { visibility: 'hidden' } : undefined} />
      </div>

      <div className="result-body">
        <div className={`result-meta ${pre}`} ref={setFade(0)}>
          <p className="result-type">
            {love.en} · {love.ko}
          </p>
          <p className="result-trait">{love.trait}</p>
        </div>

        <h1 id="result-title" className={`result-title ${pre}`} ref={(el) => { setFade(1)(el); titleRef.current = el; }} tabIndex={-1} style={{ '--d': '70ms' }}>
          <span>
            <Emphasis text={love.titleEmphasis} />
            {love.titleRest}
          </span>
          <span>{love.titleLine2}</span>
        </h1>

        <p className={`result-text ${pre}`} ref={setFade(2)} style={{ '--d': '140ms' }}>
          {love.body}
        </p>

        <div className="result-actions">
          <ul className={`keywords ${pre}`} ref={setFade(3)} aria-label="키워드" style={{ '--d': '210ms' }}>
            {love.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <div className={`result-cta ${pre}`} ref={setFade(4)} style={{ '--d': '280ms' }}>
            <button type="button" className="btn btn-primary" onClick={onNext} aria-disabled={busy ? 'true' : undefined}>
              <span>행운의 날짜/장소 확인하기!</span>
              <span className="btn-chip">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
