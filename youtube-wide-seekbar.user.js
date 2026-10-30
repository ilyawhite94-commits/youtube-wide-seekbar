// ==UserScript==
// @name         YouTube Wide Seekbar Hover Zone
// @name:ru      YouTube: широкая зона превью на полосе прогресса
// @namespace    https://github.com/ilyawhite94-commits/youtube-wide-seekbar
// @version      2.3
// @description  Adds an invisible hover zone above the YouTube progress bar (in the main player and in the hover previews on the home page / search), so the preview thumbnails work without pointing exactly at the thin line.
// @description:ru  Добавляет широкую зону над полосой прогресса YouTube (в основном плеере и в превью при наведении на главной и в поиске): превью кадров работает, даже если курсор не на самой линии.
// @author       Ilya White
// @license      MIT
// @copyright    2026, Ilya White (https://github.com/ilyawhite94-commits)
// @supportURL   https://github.com/ilyawhite94-commits/youtube-wide-seekbar/issues
// @noframes
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @homepageURL  https://github.com/ilyawhite94-commits/youtube-wide-seekbar
// @downloadURL  https://raw.githubusercontent.com/ilyawhite94-commits/youtube-wide-seekbar/main/youtube-wide-seekbar.user.js
// @updateURL    https://raw.githubusercontent.com/ilyawhite94-commits/youtube-wide-seekbar/main/youtube-wide-seekbar.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Settings / Настройки ----------
  const ZONE_UP = 150;          // zone height above the bar in the main player, px / высота зоны в основном плеере, px
  const ZONE_UP_PREVIEW = 50;   // zone height in the hover preview on the home page / search, px / высота зоны в превью на главной и в поиске, px
  const REQUIRE_SHIFT = false;  // true = zone works only while Shift is held / зона работает только с Shift
  const DEBUG_VISIBLE = true;   // true = zone is highlighted in red / зона подсвечена красным
  const DEBUG_LOG = true;       // true = log the preview's elements to the console (F12) / писать в консоль (F12) элементы превью
  // ------------------------------------------

  const style = document.createElement('style');
  style.textContent = `
    .wsb-zone {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${ZONE_UP}px;
      z-index: 60;
      cursor: pointer;
      pointer-events: ${REQUIRE_SHIFT ? 'none' : 'auto'};
      background: ${DEBUG_VISIBLE ? 'r// ==UserScript==
// @name         YouTube Wide Seekbar Hover Zone
// @name:ru      YouTube: широкая зона превью на полосе прогресса
// @namespace    https://github.com/ilyawhite94-commits/youtube-wide-seekbar
// @version      2.3
// @description  Adds an invisible hover zone above the YouTube progress bar (in the main player and in the hover previews on the home page / search), so the preview thumbnails work without pointing exactly at the thin line.
// @description:ru  Добавляет широкую зону над полосой прогресса YouTube (в основном плеере и в превью при наведении на главной и в поиске): превью кадров работает, даже если курсор не на самой линии.
// @author       Ilya White
// @license      MIT
// @copyright    2026, Ilya White (https://github.com/ilyawhite94-commits)
// @supportURL   https://github.com/ilyawhite94-commits/youtube-wide-seekbar/issues
// @noframes
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @homepageURL  https://github.com/ilyawhite94-commits/youtube-wide-seekbar
// @downloadURL  https://raw.githubusercontent.com/ilyawhite94-commits/youtube-wide-seekbar/main/youtube-wide-seekbar.user.js
// @updateURL    https://raw.githubusercontent.com/ilyawhite94-commits/youtube-wide-seekbar/main/youtube-wide-seekbar.user.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Settings / Настройки ----------
  const ZONE_UP = 150;          // zone height above the bar in the main player, px / высота зоны в основном плеере, px
  const ZONE_UP_PREVIEW = 50;   // zone height in the hover preview on the home page / search, px / высота зоны в превью на главной и в поиске, px
  const REQUIRE_SHIFT = false;  // true = zone works only while Shift is held / зона работает только с Shift
  const DEBUG_VISIBLE = true;   // true = zone is highlighted in red / зона подсвечена красным
  const DEBUG_LOG = true;       // true = log the preview's elements to the console (F12) / писать в консоль (F12) элементы превью
  // ------------------------------------------

  const style = document.createElement('style');
  style.textContent = `
    .wsb-zone {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${ZONE_UP}px;
      z-index: 60;
      cursor: pointer;
      pointer-events: ${REQUIRE_SHIFT ? 'none' : 'auto'};
      background: ${DEBUG_VISIBLE ? 'rgba(255,0,0,0.05)' : 'transparent'};
    }
    html.wsb-shift .wsb-zone { pointer-events: auto; }
  `;
  document.head.appendChild(style);

  if (REQUIRE_SHIFT) {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') document.documentElement.classList.add('wsb-shift');
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') document.documentElement.classList.remove('wsb-shift');
    });
    window.addEventListener('blur', () => {
      document.documentElement.classList.remove('wsb-shift');
    });
  }

  const PREVIEW_ROOTS = 'ytd-video-preview, [class*="inline-preview"]';
  const BAR_SELECTOR = '.ytp-progress-bar, ytd-video-preview [class*="progress-bar"], [class*="inline-preview"] [class*="progress-bar"]';

  function addZone(bar) {
    if (bar.querySelector(':scope > .wsb-zone')) return;
    if (bar.getBoundingClientRect().width < 100) return; // skip tiny helper elements
    const zone = document.createElement('div');
    zone.className = 'wsb-zone';
    const inPreview = !!bar.closest(PREVIEW_ROOTS);
    zone.style.height = `${inPreview ? ZONE_UP_PREVIEW : ZONE_UP}px`;
    bar.appendChild(zone);
  }

  // Diagnostics: list the preview's elements related to the progress bar
  let lastLog = '';
  function logPreview() {
    const roots = document.querySelectorAll(PREVIEW_ROOTS);
    if (!roots.length) return;
    const found = [];
    roots.forEach((root) => {
      [root, ...root.querySelectorAll('*')].forEach((el) => {
        const cls = (el.getAttribute('class') || '').trim();
        if (!/progress|scrub|seek|timeline/i.test(cls)) return;
        const r = el.getBoundingClientRect();
        found.push(`${el.tagName.toLowerCase()}.${cls.split(/\s+/).join('.')} (${Math.round(r.width)}x${Math.round(r.height)})`);
      });
    });
    const text = [...new Set(found)].join(' | ');
    if (text && text !== lastLog) {
      lastLog = text;
      console.log('[wide-seekbar] элементы превью:', text);
    }
  }

  // YouTube creates and removes players on the fly (the hover preview appears and disappears),
  // so we check often and add a zone to every progress bar that has none.
  // YouTube создаёт и удаляет плееры на лету (превью при наведении), поэтому часто проверяем все полосы.
  function tick() {
    document.querySelectorAll(BAR_SELECTOR).forEach(addZone);
    if (DEBUG_LOG) logPreview();
  }

  setInterval(tick, 300);
  tick();
})();gba(255,0,0,0.05)' : 'transparent'};
    }
    html.wsb-shift .wsb-zone { pointer-events: auto; }
  `;
  document.head.appendChild(style);

  if (REQUIRE_SHIFT) {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') document.documentElement.classList.add('wsb-shift');
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') document.documentElement.classList.remove('wsb-shift');
    });
    window.addEventListener('blur', () => {
      document.documentElement.classList.remove('wsb-shift');
    });
  }

  const PREVIEW_ROOTS = 'ytd-video-preview, [class*="inline-preview"]';
  const BAR_SELECTOR = '.ytp-progress-bar, ytd-video-preview [class*="progress-bar"], [class*="inline-preview"] [class*="progress-bar"]';

  function addZone(bar) {
    if (bar.querySelector(':scope > .wsb-zone')) return;
    if (bar.getBoundingClientRect().width < 100) return; // skip tiny helper elements
    const zone = document.createElement('div');
    zone.className = 'wsb-zone';
    const inPreview = !!bar.closest(PREVIEW_ROOTS);
    zone.style.height = `${inPreview ? ZONE_UP_PREVIEW : ZONE_UP}px`;
    bar.appendChild(zone);
  }

  // Diagnostics: list the preview's elements related to the progress bar
  let lastLog = '';
  function logPreview() {
    const roots = document.querySelectorAll(PREVIEW_ROOTS);
    if (!roots.length) return;
    const found = [];
    roots.forEach((root) => {
      [root, ...root.querySelectorAll('*')].forEach((el) => {
        const cls = (el.getAttribute('class') || '').trim();
        if (!/progress|scrub|seek|timeline/i.test(cls)) return;
        const r = el.getBoundingClientRect();
        found.push(`${el.tagName.toLowerCase()}.${cls.split(/\s+/).join('.')} (${Math.round(r.width)}x${Math.round(r.height)})`);
      });
    });
    const text = [...new Set(found)].join(' | ');
    if (text && text !== lastLog) {
      lastLog = text;
      console.log('[wide-seekbar] элементы превью:', text);
    }
  }

  // YouTube creates and removes players on the fly (the hover preview appears and disappears),
  // so we check often and add a zone to every progress bar that has none.
  // YouTube создаёт и удаляет плееры на лету (превью при наведении), поэтому часто проверяем все полосы.
  function tick() {
    document.querySelectorAll(BAR_SELECTOR).forEach(addZone);
    if (DEBUG_LOG) logPreview();
  }

  setInterval(tick, 300);
  tick();
})();
