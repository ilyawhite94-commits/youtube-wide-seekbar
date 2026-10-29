// ==UserScript==
// @name         YouTube Wide Seekbar Hover Zone
// @name:ru      YouTube: широкая зона превью на полосе прогресса
// @namespace    https://github.com/ilyawhite94-commits/youtube-wide-seekbar
// @version      2.1
// @description  Adds an invisible hover zone above the YouTube progress bar, so the preview thumbnails work without pointing exactly at the thin line.
// @description:ru  Добавляет широкую зону над полосой прогресса YouTube: превью кадров работает, даже если курсор не на самой линии.
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
  const ZONE_UP = 150;         // zone height above the bar, px / высота зоны над полосой, px
  const REQUIRE_SHIFT = false; // true = zone works only while Shift is held / зона работает только с Shift
  const DEBUG_VISIBLE = true;  // true = zone is highlighted in red / зона подсвечена красным
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
      background: ${DEBUG_VISIBLE ? 'rgba(255,0,0,0.25)' : 'transparent'};
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

  // YouTube changes pages without reloading, so re-check periodically
  // YouTube меняет страницу без перезагрузки, поэтому проверяем наличие зоны периодически
  function ensureZone() {
    const bar = document.querySelector('.ytp-progress-bar');
    if (!bar || bar.querySelector(':scope > .wsb-zone')) return;
    const zone = document.createElement('div');
    zone.className = 'wsb-zone';
    bar.appendChild(zone);
  }

  setInterval(ensureZone, 1000);
  ensureZone();
})();
