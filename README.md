# YouTube Wide Seekbar Hover Zone

## English

The YouTube progress bar is only a few pixels thick, so the preview thumbnails appear only while the cursor sits exactly on the line, and the preview jumps around with every small mouse movement.

This userscript adds an invisible hover zone above the progress bar (150 px by default). Move the mouse left and right anywhere inside the zone while looking at the preview picture, and you don't have to keep the cursor on the line.

**Install**
1. Install the Tampermonkey extension.
2. In Chrome, open `chrome://extensions` → Tampermonkey → Details and turn on **Allow user scripts**.
3. Open the script file (or paste its code into a new Tampermonkey script) and install it.
4. Reload YouTube.

**Settings** (at the top of the script)
- `ZONE_UP`: height of the zone above the bar, in pixels.
- `REQUIRE_SHIFT`: if `true`, the zone only works while Shift is held.
- `DEBUG_VISIBLE`: if `true`, the zone is shown as a translucent red area. Set to `false` to hide it.

**Note:** a click inside the zone seeks the video instead of pausing it. If this bothers you, lower `ZONE_UP` or set `REQUIRE_SHIFT = true`.

License: MIT. Author: Ilya White

## Русский

Полоса прогресса на YouTube очень тонкая, поэтому превью кадров показывается, только когда курсор точно на линии, и прыгает от любого движения мыши.

Скрипт добавляет невидимую зону над полосой прогресса (по умолчанию 150 пикселей). Ведите мышь влево и вправо в любом месте этой зоны, глядя на картинку превью, и не нужно следить, чтобы курсор был на линии.

**Установка**
1. Установите расширение Tampermonkey.
2. В Chrome откройте `chrome://extensions` → Tampermonkey → «Подробнее» и включите **«Разрешить пользовательские скрипты»**.
3. Откройте файл скрипта (или вставьте его код в новый скрипт Tampermonkey) и установите.
4. Обновите страницу YouTube.

**Настройки** (в начале скрипта)
- `ZONE_UP`: высота зоны над полосой в пикселях.
- `REQUIRE_SHIFT`: если `true`, зона работает только при зажатом Shift.
- `DEBUG_VISIBLE`: если `true`, зона подсвечена полупрозрачным красным. Поставьте `false`, чтобы скрыть подсветку.

**Важно:** клик внутри зоны перематывает видео, а не ставит его на паузу. Если это мешает, уменьшите `ZONE_UP` или включите `REQUIRE_SHIFT = true`.

Лицензия: MIT. Автор: Ilya White
