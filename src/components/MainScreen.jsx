import React, { useLayoutEffect, useRef } from 'react';
import { CardBack } from './Card.jsx';
import { ArrowIcon } from './Icons.jsx';
import { prefersReducedMotion } from '../lib/motion.js';

// 확정 시안(04 Halo × Type)의 카드 궤도 — 궤도 중심 기준 좌표(px), 회전, 점 방향
export const RING = [
  { dx: 0, dy: -130, r: -3, dot: 'b' },
  { dx: 97, dy: -65, r: 7, dot: 'bl' },
  { dx: 97, dy: 65, r: -5, dot: 'tl' },
  { dx: 0, dy: 130, r: 3, dot: 't' },
  { dx: -97, dy: 65, r: 6, dot: 'tr' },
  { dx: -97, dy: -65, r: -7, dot: 'br' },
];

export default function MainScreen({ api, busy, onDraw, restore }) {
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const fadeRefs = useRef([]);
  const orbRef = useRef(null);

  // App이 애니메이션에 쓸 수 있도록 DOM 참조를 넘깁니다.
  api.current = { ring: ringRef, cards: cardRefs, fades: fadeRefs, orb: orbRef };

  // "다시 뽑기"로 돌아왔을 때 — 중앙에 모여 있던 카드가 원래 자리로 펼쳐집니다.
  useLayoutEffect(() => {
    const fades = fadeRefs.current.filter(Boolean);
    if (!restore) {
      requestAnimationFrame(() => fades.forEach((el) => el.classList.add('is-in')));
      return;
    }
    const reduce = prefersReducedMotion();
    const ring = ringRef.current;
    const rc = ring.getBoundingClientRect();
    const cx = rc.left + rc.width / 2;
    const cy = rc.top + rc.height / 2;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = el.getBoundingClientRect();
      const tx = cx - (b.left + b.width / 2);
      const ty = cy - (b.top + b.height / 2);
      const r = RING[i].r;
      if (reduce) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'backwards' });
        return;
      }
      el.animate(
        [
          { transform: `translate(${tx}px, ${ty}px) rotate(0deg)`, opacity: 0 },
          { transform: `translate(${tx}px, ${ty}px) rotate(0deg)`, opacity: 1, offset: 0.25 },
          { transform: `rotate(${r}deg)`, opacity: 1 },
        ],
        { duration: 1100, delay: 120 + i * 45, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
      );
    });
    requestAnimationFrame(() => fades.forEach((el) => el.classList.add('is-in')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFade = (i) => (el) => (fadeRefs.current[i] = el);

  return (
    <main className="screen main" aria-labelledby="main-title">
      <div className="bg-layer" aria-hidden="true"><div className="glow-bottom main-glow" /></div>
      <p className="topbar main-top">11월의 사랑 운세</p>

      <div className="main-intro">
        <h1 id="main-title" className="main-title reveal" ref={setFade(0)} aria-label="당신의 11월, 어떤 사랑이 응답할까요?">
          <span aria-hidden="true">당신의 11월,</span>
          <span aria-hidden="true">어떤 사랑이</span>
          <span aria-hidden="true">
            <span className="hl">
              응답
              <i className="hl-line hl-line-l" />
              <i className="hl-knob hl-knob-l" />
              <i className="hl-line hl-line-r" />
              <i className="hl-knob hl-knob-r" />
            </span>
            할까요?
          </span>
        </h1>
        <p className="main-sub reveal" ref={setFade(1)} style={{ '--d': '80ms' }}>
          여섯 가지 사랑 중,
          <br />
          지금의 당신에게 닿을 하나를 만나보세요.
        </p>
      </div>

      <div className="ring-wrap">
        <div className="ring" ref={ringRef} role="img" aria-label="한 점을 둘러싸고 떠 있는 여섯 장의 카드 뒷면">
          <div className="orb ring-orb" ref={orbRef} />
          <div className="ring-cross" aria-hidden="true" />
          {RING.map((c, i) => (
            <CardBack
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              dot={c.dot}
              className="ring-card"
              style={{ '--dx': c.dx, '--dy': c.dy, '--r': `${c.r}deg`, zIndex: i === 0 ? 7 : 6 - i }}
            />
          ))}
        </div>
      </div>

      <div className="main-cta reveal" ref={setFade(2)} style={{ '--d': '160ms' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onDraw}
          aria-disabled={busy ? 'true' : undefined}
        >
          <span>11월의 사랑을 뽑아보세요</span>
          <span className="btn-chip">
            <ArrowIcon />
          </span>
        </button>
      </div>
    </main>
  );
}
