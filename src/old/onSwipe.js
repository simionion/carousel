export function onSwipe(targetEl, options = {}) {
  const { useVertical = true } = options;
  let startX;
  let startY;
  let currentX;
  let currentY;

  function start(event) {
    startX = event.touches ? event.touches[0].clientX : event.clientX;
    startY = event.touches ? event.touches[0].clientY : event.clientY;
    currentX = startX;
    currentY = startY;
  }

  function move(event) {
    if (!startX || !startY) return;
    currentX = event.touches ? event.touches[0].clientX : event.clientX;
    currentY = event.touches ? event.touches[0].clientY : event.clientY;

    const direction = useVertical ? (currentY > startY ? 'up' : 'down') : currentX > startX ? 'left' : 'right';
    const distance = useVertical ? currentY - startY : currentX - startX;
    const diff = useVertical ? event.movementY : event.movementX;
    targetEl.dispatchEvent(
      new CustomEvent('swipe', { detail: { direction, distance: distance * -1, diff: diff * -1 }, composed: true }) //mouse events are inverted compared to scroll events
    );
    return false; // prevent parent scrolling
  }

  let wheelTimer;

  function wheel(event) {
    if (!startX || !startY) start(event);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(end, 50);

    const diff = useVertical ? event.deltaY : event.deltaX;
    useVertical ? (currentY += diff) : (currentX += diff);
    const distance = useVertical ? currentY - startY : currentX - startX;
    const direction = useVertical ? (event.deltaY > 0 ? 'down' : 'up') : event.deltaX > 0 ? 'right' : 'left';
    targetEl.dispatchEvent(new CustomEvent('swipe', { detail: { direction, distance, diff }, composed: true }));
    return false; // prevent parent scrolling
  }

  function end() {
    startX = startY = currentX = currentY = wheelTimer = undefined;
  }

  toggleEvents(true);

  function toggleEvents(on = true) {
    const addOrRemove = on ? 'addEventListener' : 'removeEventListener';

    const WheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    const mappedEvents = [
      { handler: start, events: ['mousedown', 'touchstart'] },
      { handler: wheel, events: [WheelEvent, 'scroll'] },
      { handler: move, events: ['mousemove', 'touchmove'] },
      { handler: end, events: ['mouseup', 'touchend', 'touchcancel', 'mouseleave'] },
    ];

    const passiveEvents = ['touchstart', 'touchmove', 'mousemove', WheelEvent];

    mappedEvents.forEach(({ handler, events }) =>
      events.forEach(event => targetEl[addOrRemove](event, handler, { passive: passiveEvents.includes(event) }))
    );
  }

  return function onDestroy() {
    toggleEvents(false);
  };
}
