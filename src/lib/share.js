import { SHARE } from '../data/loves.js';

function siteUrl() {
  const { origin, pathname } = window.location;
  return origin + pathname;
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    /* 아래 대체 방식으로 */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

/**
 * 기기 기본 공유 메뉴(Web Share API)를 열고, 지원하지 않으면 링크를 복사합니다.
 * @returns {'shared' | 'cancelled' | 'copied' | 'failed'}
 */
export async function shareSite() {
  const data = { title: SHARE.title, text: SHARE.text, url: siteUrl() };
  if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled';
      // 권한 문제 등 — 링크 복사로 대체
    }
  }
  return (await copyText(data.url)) ? 'copied' : 'failed';
}
