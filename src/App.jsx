import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import MainScreen from './components/MainScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import InviteScreen from './components/InviteScreen.jsx';
import { CardBack, CardFront } from './components/Card.jsx';
import { drawLove, LOVES } from './data/loves.js';
import { gatherAndFlip, landOnResult } from './lib/drawSequence.js';
import { prefersReducedMotion, run, nextFrame, wait } from './lib/motion.js';
import { shareSite } from './lib/share.js';

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

export default function App() {
  const [screen, setScreen] = useState('main'); // 'main' | 'result' | 'invite'
  const [love, setLove] = useState(null);
  const [flyLove, setFlyLove] = useState(null);
  const [arriving, setArriving] = useState(false);
  const [restore, setRestore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [mainKey, setMainKey] = useState(0);

  const busyRef = useRef(false);
  const mainApi = useRef(null);
  const resultApi = useRef(null);
  const inviteApi = useRef(null);
  const flyRef = useRef(null);
  const toastTimer = useRef(null);

  const lock = (v) => {
    busyRef.current = v;
    setBusy(v);
  };

  const go = (next, opts = {}) => {
    window.scrollTo(0, 0);
    if (!opts.replace) {
      try {
        window.history.pushState({ screen: next, love: opts.love?.id }, '');
      } catch (_) {}
    }
  };

  // 브라우저 뒤로가기
  useEffect(() => {
    try {
      window.history.replaceState({ screen: 'main' }, '');
    } catch (_) {}
    const onPop = (e) => {
      const st = e.state || { screen: 'main' };
      busyRef.current = false;
      setBusy(false);
      setFlyLove(null);
      setArriving(false);
      if (st.screen === 'main') {
        setRestore(false);
        setLove(null);
        setMainKey((k) => k + 1);
        setScreen('main');
      } else if (st.love) {
        setLove(LOVES.find((l) => l.id === st.love) || LOVES[0]);
        setScreen(st.screen);
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // STEP 01 → 02 → 03 : 카드 뽑기
  const handleDraw = useCallback(async () => {
    if (busyRef.current) return;
    lock(true);
    const picked = drawLove();

    if (prefersReducedMotion()) {
      const root = document.querySelector('.main');
      await run(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
      flushSync(() => {
        setLove(picked);
        setArriving(false);
        setScreen('result');
      });
      go('result', { love: picked });
      await run(document.querySelector('.result'), [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      resultApi.current?.title.current?.focus({ preventScroll: true });
      lock(false);
      return;
    }

    // 날아갈 카드(앞면에 결과가 미리 들어 있음)를 준비
    flushSync(() => setFlyLove(picked));
    await nextFrame();

    await gatherAndFlip({ main: mainApi.current, getFly: () => flyRef.current });

    // 결과 화면으로 교체 (배경이 같아 화면은 끊기지 않음)
    flushSync(() => {
      setLove(picked);
      setArriving(true);
      setScreen('result');
    });
    go('result', { love: picked });

    await landOnResult({ result: resultApi.current, getFly: () => flyRef.current });
    await wait(450);
    flushSync(() => {
      setArriving(false);
      setFlyLove(null);
    });
    resultApi.current?.title.current?.focus({ preventScroll: true });
    lock(false);
  }, []);

  // STEP 03 → 04 : 초대장
  const handleInvite = useCallback(async () => {
    if (busyRef.current) return;
    lock(true);
    const root = resultApi.current?.root.current;
    if (!prefersReducedMotion()) {
      await run(root, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], {
        duration: 380,
        easing: EASE,
        fill: 'forwards',
      });
    }
    flushSync(() => setScreen('invite'));
    go('invite', { love });
    inviteApi.current?.title.current?.focus({ preventScroll: true });
    await wait(300);
    lock(false);
  }, [love]);

  // 다시 뽑기
  const handleRetry = useCallback(async () => {
    if (busyRef.current) return;
    lock(true);
    const root = inviteApi.current?.root.current;
    if (!prefersReducedMotion()) {
      await run(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: EASE, fill: 'forwards' });
    }
    flushSync(() => {
      setLove(null);
      setRestore(true);
      setMainKey((k) => k + 1);
      setScreen('main');
    });
    go('main');
    await wait(prefersReducedMotion() ? 300 : 1400);
    lock(false);
  }, []);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const handleShare = useCallback(async () => {
    const r = await shareSite();
    if (r === 'copied') showToast('링크가 복사되었어요');
    else if (r === 'failed') showToast('링크를 복사하지 못했어요');
  }, []);

  return (
    <div className="app">
      {screen === 'main' && (
        <MainScreen key={mainKey} api={mainApi} busy={busy} onDraw={handleDraw} restore={restore} />
      )}
      {screen === 'result' && love && (
        <ResultScreen love={love} api={resultApi} onNext={handleInvite} busy={busy} arriving={arriving} />
      )}
      {screen === 'invite' && (
        <InviteScreen api={inviteApi} onRetry={handleRetry} onShare={handleShare} busy={busy} />
      )}

      {flyLove && (
        <div className="fly" ref={flyRef} style={{ visibility: 'hidden' }} aria-hidden="true">
          <div className="fly-flipper">
            <CardBack dot="b" className="fly-face" />
            <CardFront love={flyLove} hidden className="fly-face" />
          </div>
        </div>
      )}

      <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
      <p className="sr-only" aria-live="polite">
        {screen === 'result' && love && !arriving ? `당신의 11월의 사랑은 ${love.en} ${love.ko}입니다.` : ''}
      </p>
    </div>
  );
}
