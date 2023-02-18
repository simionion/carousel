<script>
  import { onMount } from 'svelte';
  import ArrowButton from './ArrowButton.svelte';

  export let columnCount = 3;
  export let bundlesCount;
  export let gutterWidth = 20;
  export let startIndex = 0;
  export let maxIndex = 0;
  export let carouselIndex = startIndex;
  export let cardWidth;
  export let arrowsOffset = 10;
  export let isExtended = false;

  let debug = true;
  let sequence, carouselClientWidth, stepTranslateX, slideDebounce;
  let translateX = 0;
  let isRight = false;
  let showTransition = false;
  let isTransitioning = false;
  let lastCarouselWidth;
  let transitionTime = 500;
  let currentTransitionTime = transitionTime;
  let effect = 'ease';
  let steps = 0;

  $: if (carouselClientWidth != lastCarouselWidth && !isTransitioning) {
    lastCarouselWidth = carouselClientWidth;
    const spacingAll = columnCount * gutterWidth;
    cardWidth = (carouselClientWidth - spacingAll) / columnCount;
    stepTranslateX = cardWidth + gutterWidth;

    noAnimation();
    translateX = stepTranslateX;
  }

  onMount(() => {
    let moves = startIndex;
    while (moves-- > 0) sequence.append(sequence.firstElementChild);
    sequence.prepend(sequence.lastElementChild);
  });

  function noAnimation() {
    showTransition = false;
    setTimeout(() => (showTransition = true), 3);
  }

  export function fnSlideTo(index = 0, useAnimation = true) {
    let distance = Math.abs(carouselIndex - index);
    steps = Math.min(distance, maxIndex + 1 - distance);

    effect = steps > 1 || slideDebounce ? 'linear' : 'ease';
    if (index == carouselIndex) {
      slideDebounce = null;
      currentTransitionTime = transitionTime;
      return;
    }

    if (!useAnimation) {
      noAnimation();
      isRight = carouselIndex < index;
      let seqArr = [...sequence.children];
      let seqSlices = isRight ? seqArr.slice(0, steps) : seqArr.slice(seqArr.length - steps);

      if (isRight) sequence.append(...seqSlices);
      else sequence.prepend(...seqSlices);

      carouselIndex = index;
      return;
    }

    if (!slideDebounce) currentTransitionTime = transitionTime / steps;

    slideDebounce = () => fnSlideTo(index);
    if (index < columnCount - 1 && carouselIndex > maxIndex - columnCount) slide(true);
    else slide(carouselIndex < index);
  }

  function slide(right = true) {
    isRight = right;
    if (isTransitioning) return;
    isTransitioning = true;
    translateX += stepTranslateX * (isRight ? 1 : -1);

    if (isRight) carouselIndex = carouselIndex == maxIndex ? 0 : carouselIndex + 1;
    else carouselIndex = carouselIndex == 0 ? maxIndex : carouselIndex - 1;
  }

  function onTransitionStart() {
    isTransitioning = true;
  }

  function onTransitionEnd() {
    noAnimation();
    translateX += stepTranslateX * (isRight ? -1 : 1);

    if (isRight) sequence.append(sequence.firstElementChild);
    else sequence.prepend(sequence.lastElementChild);

    setTimeout(() => (isTransitioning = false), 1);
    if (slideDebounce) setTimeout(() => window.requestAnimationFrame(slideDebounce), 1);
  }

  export function fnSlideLeft() {
    slide(false);
  }

  export function fnSlideRight() {
    slide(true);
  }

  let touchstartX, touchendX;

  function onTouchStart(e) {
    if (!isExtended) {
      touchstartX = e.changedTouches[0].screenX;
    }
  }

  function onTouchEnd(e) {
    if (!isExtended) {
      touchendX = e.changedTouches[0].screenX;
      if (touchendX == touchstartX) return;
      slide(touchendX < touchstartX);
    }
  }
</script>

<style>
  .stylitics-dimension-inner {
    overflow: hidden;
    height: 100%;
    padding: 8px 0;
    width: 100%;
  }

  .stylitics-dimension-sequence {
    display: flex;
    width: fit-content;
    height: 100%;
    transition: var(--transition);
    transform: var(--translateX, 0);
  }
</style>

<div
  class="stylitics-dimension-carousel"
  style:width="{columnCount >= bundlesCount ? '85%' : '100%'}"
  style:margin="{columnCount >= bundlesCount ? '0 auto' : '0'}"
>
  {#if !isExtended}
    <ArrowButton
      side="left"
      on:clickArrow="{fnSlideLeft}"
      offset="left: {arrowsOffset}px"
    />
  {/if}

  <div
    class="stylitics-dimension-inner"
    bind:clientWidth="{carouselClientWidth}"
  >
    <div
      class="stylitics-dimension-sequence"
      bind:this="{sequence}"
      style:--translateX="translateX(-{translateX}px)"
      style:--transition="{showTransition ? `transform ${currentTransitionTime}ms ${effect}` : 'none'}"
      on:transitionstart|self="{onTransitionStart}"
      on:transitionend|self="{showTransition ? onTransitionEnd : null}"
      on:touchstart|passive="{onTouchStart}"
      on:touchend|passive="{onTouchEnd}"
    >
      <slot
        cardWidth="{cardWidth}"
        bundlesCount="{bundlesCount}"
        columnCount="{columnCount}"
        carouselIndex="{carouselIndex}"
        fnSlideTo="{fnSlideTo}"
      />
    </div>
  </div>

  {#if !isExtended}
    <ArrowButton
      slot="arrow-right"
      side="right"
      on:clickArrow="{fnSlideRight}"
      offset="right: {arrowsOffset}px"
    />
  {/if}
</div>

{#if debug}
  <div
    style="white-space: pre-line;
           position: fixed; bottom: 0; inset-inline: 0;
           height: auto; padding: 10px; background-color: #CFCFCF;
           display: flex; justify-content: center; align-items: center;"
  >
    carouselIndex {carouselIndex}
    translateX {translateX}
    effect {effect}
    showTransition {showTransition}
    currentTransitionTime {currentTransitionTime}
    steps {steps}
  </div>
{/if}
