// 카드 뽑기 애니메이션
// 메인 화면의 실제 카드 6장 → 중앙으로 모임 → 한 장으로 겹침
// → 3D로 뒤집히며 커짐 → 결과 화면의 카드 자리로 이동 → 텍스트 등장

import { run, wait, nextFrame } from './motion.js';
import { RING } from '../components/MainScreen.jsx';

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

function center(el) {
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
}

function placeBox(el, cx, cy, w) {
  const h = w * 1.5;
  el.style.left = `${cx - w / 2}px`;
  el.style.top = `${cy - h / 2}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  return { left: cx - w / 2, top: cy - h / 2, width: w, height: h };
}

/** 1–4단계: 메인 화면 위에서 진행 */
export async function gatherAndFlip({ main, getFly }) {
  const ring = main.ring.current;
  const cards = main.cards.current.filter(Boolean);
  const fades = main.fades.current.filter(Boolean);
  ring.classList.add('is-busy');

  // 텍스트·버튼은 조용히 물러남
  fades.forEach((el) => el.classList.add('fade-out'));

  // 1–3. 여섯 장이 궤도 중심으로 모여 정확히 겹침 (맨 위 카드는 마지막에 도착)
  const c = center(ring);
  const order = [1, 2, 3, 4, 5, 0];
  const moves = order.map((i, k) => {
    const el = cards[i];
    const p = center(el);
    const tx = c.x - p.x;
    const ty = c.y - p.y;
    return run(
      el,
      [
        { transform: `rotate(${RING[i].r}deg)` },
        { transform: `translate(${tx * 0.08}px, ${ty * 0.08 - 4}px) rotate(${RING[i].r * 1.15}deg)`, offset: 0.12 },
        { transform: `translate(${tx}px, ${ty}px) rotate(0deg)` },
      ],
      { duration: 1000, delay: k * 55, easing: EASE, fill: 'forwards' }
    );
  });
  await Promise.all(moves);

  // 겹친 카드가 한 번 숨을 고름
  const top = cards[0];
  const topRect = top.getBoundingClientRect();
  const w0 = top.offsetWidth;

  // 4. 같은 자리에 같은 모습의 '날아가는 카드'를 겹쳐 놓고 실제 카드는 숨김 (화면상 변화 없음)
  const fly = getFly();
  const flipper = fly.querySelector('.fly-flipper');
  placeBox(fly, topRect.left + topRect.width / 2, topRect.top + topRect.height / 2, w0);
  fly.style.visibility = 'visible';
  cards.forEach((el) => (el.style.visibility = 'hidden'));

  // 십자 표시는 사라지고, 궤도의 빛은 카드가 뒤집히는 동안 천천히 옅어짐
  run(main.orb.current, [{ opacity: 1 }, { opacity: 0.9, offset: 0.3 }, { opacity: 0 }], {
    duration: 2000,
    delay: 400,
    easing: EASE,
    fill: 'forwards',
  });
  const cross = ring.querySelector('.ring-cross');
  run(cross, [{ opacity: 0.55 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });

  await run(fly, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], {
    duration: 420,
    easing: EASE,
  });

  // 뒤집히며 결과 카드 크기로 커짐
  const bigW = window.innerWidth >= 900 ? Math.min(260, 172 * 1.38) : 172;
  const from = { left: fly.offsetLeft, top: fly.offsetTop, width: w0, height: w0 * 1.5 };
  const cx = from.left + from.width / 2;
  let cy = from.top + from.height / 2;
  // 화면 안에 들어오도록
  const half = (bigW * 1.5) / 2 + 16;
  cy = Math.min(Math.max(cy, half), window.innerHeight - half);
  const to = placeBox(fly, cx, cy, bigW);

  const grow = run(
    fly,
    [
      { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 1150, easing: EASE }
  );
  const flip = run(
    flipper,
    [
      { transform: 'rotateY(0deg)' },
      { transform: 'rotateY(100deg) translateZ(18px)', offset: 0.55 },
      { transform: 'rotateY(180deg)' },
    ],
    { duration: 1050, delay: 120, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' }
  );
  await Promise.all([grow, flip]);

  // 앞면을 평면 상태로 정리 — 보이는 모습은 그대로
  fly.classList.add('is-settled');
  flipper.getAnimations().forEach((a) => a.cancel());

  await wait(420);
}

/** 5–7단계: 결과 화면이 그려진 직후 실행 */
export async function landOnResult({ result, getFly }) {
  const fly = getFly();
  const slot = result.slot.current;
  const ghosts = result.ghosts.current.filter(Boolean);
  const orb = result.orb.current;

  // 슬롯의 실제 위치(회전 전 크기) 측정
  const sc = center(slot);
  const w = slot.offsetWidth;
  const h = slot.offsetHeight;
  const from = { left: fly.offsetLeft, top: fly.offsetTop, width: fly.offsetWidth, height: fly.offsetHeight };
  const to = { left: sc.x - w / 2, top: sc.y - h / 2, width: w, height: h };

  orb.style.opacity = '';
  run(orb, [{ opacity: 0 }, { opacity: 1 }], { duration: 1100, easing: EASE_OUT, fill: 'backwards' });

  const move = run(
    fly,
    [
      { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, transform: 'rotate(0deg)' },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, transform: 'rotate(-2deg)' },
    ],
    { duration: 850, easing: EASE, fill: 'forwards' }
  );

  // 뒤에 겹친 카드가 결과 카드 뒤에서 살짝 펼쳐짐
  const ghostTo = [
    { r: 6, o: 0.55 },
    { r: -7, o: 0.45 },
  ];
  ghosts.forEach((g, i) => {
    g.style.opacity = '';
    run(
      g,
      [
        { transform: 'rotate(-2deg)', opacity: 0 },
        { transform: `rotate(${ghostTo[i].r}deg)`, opacity: ghostTo[i].o },
      ],
      { duration: 900, delay: 600 + i * 90, easing: EASE_OUT, fill: 'backwards' }
    );
  });

  await move;
  slot.style.visibility = 'visible';
  await nextFrame();
  fly.style.visibility = 'hidden';

  // 텍스트 등장
  result.fades.current.filter(Boolean).forEach((el) => el.classList.add('is-in'));
}
