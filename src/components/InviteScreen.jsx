import React, { useLayoutEffect, useRef } from 'react';
import { INVITE } from '../data/loves.js';
import { Emphasis, RetryIcon, ShareIcon } from './Icons.jsx';

export default function InviteScreen({ api, onRetry, onShare, busy }) {
  const fadeRefs = useRef([]);
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  api.current = { fades: fadeRefs, root: rootRef, title: titleRef };

  useLayoutEffect(() => {
    requestAnimationFrame(() => fadeRefs.current.forEach((el) => el && el.classList.add('is-in')));
  }, []);

  let n = 0;
  const f = (extra = '') => {
    const i = n++;
    return {
      ref: (el) => (fadeRefs.current[i] = el),
      className: `reveal ${extra}`.trim(),
      style: { '--d': `${i * 70}ms` },
    };
  };

  return (
    <main className="screen invite" ref={rootRef} aria-labelledby="invite-title">
      <div className="bg-layer" aria-hidden="true">
        <div className="orb invite-orb-1" />
        <div className="orb invite-orb-2" />
      </div>

      <p className="topbar invite-top">11월의 사랑 운세</p>

      <div className="invite-inner">
        <header className="invite-hero">
          <div {...f('invite-head')}>
            <p className="invite-eyebrow">{INVITE.eyebrow}</p>
            <h1 id="invite-title" className="invite-title" ref={titleRef} tabIndex={-1}>
              <span>
                <Emphasis text={INVITE.titleEmphasis} />
                {INVITE.titleRest}
              </span>
              <span>{INVITE.titleLine2}</span>
            </h1>
          </div>
          <p {...f('invite-sub')}>
            {INVITE.subLine1}
            <br />
            {INVITE.subLine2}
          </p>
        </header>

        <div className="invite-cols">
          <section {...f('invite-section invite-dates')} aria-labelledby="sec-dates">
            <div className="sec-head">
              <h2 id="sec-dates">행운의 날짜</h2>
              <p>Lucky Dates</p>
            </div>
            <p className="invite-year">{INVITE.year}</p>
            <ul className="date-list">
              {INVITE.dates.map((d) => (
                <li key={d.date}>
                  <span className="date-d">{d.date}</span>
                  <span className="date-w">{d.day}</span>
                  <span className="date-t">{d.time}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="invite-side">
            <section {...f('invite-section invite-place')} aria-labelledby="sec-place">
              <div className="sec-head">
                <h2 id="sec-place">행운의 장소</h2>
                <p>Lucky Place</p>
              </div>
              <p className="place-name">{INVITE.place}</p>
              <p className="place-addr">{INVITE.address}</p>
            </section>

            <section {...f('invite-section invite-work')} aria-labelledby="sec-work">
              <div className="sec-head">
                <h2 id="sec-work">{INVITE.workLabel}</h2>
                <p>Artwork</p>
              </div>
              <div className="work">
                <i className="work-dot" aria-hidden="true" />
                <p className="work-en">{INVITE.workEn}</p>
                <p className="work-ko">{INVITE.workKo}</p>
                <p className="work-meta">{INVITE.workMeta}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="invite-bottom">
          <div {...f('invite-actions')}>
            <button type="button" className="btn btn-secondary" onClick={onRetry} aria-disabled={busy ? 'true' : undefined}>
              <span>다시 뽑기</span>
              <span className="btn-chip"><RetryIcon /></span>
            </button>
            <button type="button" className="btn btn-primary" onClick={onShare}>
              <span>공유하기</span>
              <span className="btn-chip"><ShareIcon /></span>
            </button>
          </div>

          <footer {...f('invite-footer')}>
            <p className="foot-1">{INVITE.footer1}</p>
            <p className="foot-2">{INVITE.footer2}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
