<script lang="ts">
  import { onSwipe } from './onSwipe.js';
  import { onMount, tick } from 'svelte';

  let sequence: HTMLElement;

  let cards = Array.from({ length: 10 }, (_, i) => i + 1);
  let translateX = 0;

  let sequenceWidth = 1;
  let carouselWidth = 1;
  $: cardWidth = sequenceWidth / cards.length;
  $: leftCardIdx = Math.round(translateX / cardWidth) % cards.length;
  $: visibleCards = Math.ceil(carouselWidth / cardWidth);

  //

  $: console.log({ cardWidth, visibleCards, leftCardIdx });

  onMount(onResize);

  function onResize() {
    sequenceWidth = sequence.getBoundingClientRect().width;
    carouselWidth = sequence.parentElement.getBoundingClientRect().width;
    console.log({ sequenceWidth, carouselWidth });
  }

  function handleSwipe({ detail }) {
    transition(detail.diff);

    if (detail.direction === 'left') {
      //translate last right card to the left
      const lastCard = sequence.lastElementChild;
      lastCard.style.transform = `translateX(-${translateX - sequenceWidth}px)`;
    }

    if (detail.direction === 'right') {
      //translate first left card to the right
      const firstCard = sequence.firstElementChild;
      firstCard.style.transform = `translateX(${translateX + sequenceWidth}px)`;
    }
  }

  function transition(diff = 0) {
    if (diff === 0) return;
    translateX += diff > 0 ? 1 : -1;
    tick().then(() => transition(diff + (diff > 0 ? -1 : 1)));
  }
</script>

<style>
  .carousel {
    margin: auto;
    max-width: calc(100% - 200px);
    overflow: hidden;
    padding: 24px 0;
    border: 1px solid green;
    resize: horizontal;
    display: flex;
    justify-content: flex-start;
  }

  .sequence {
    position: relative;
    display: flex;
    justify-content: flex-start;
    will-change: transform;
    transform: var(--sequence__transform);
    scroll-behavior: auto;
  }

  .card {
    display: flex;
    min-width: 200px;
    min-height: 250px;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background-color: #ececec;
    border-radius: 3px;
    scroll-snap-align: center;
    margin-left: 20px;
  }

  .btn {
    position: absolute;
    top: 110px;
    max-width: 10%;
    height: 100px;
    font-size: 4rem;
    line-height: 20px;
  }

  .btn-left {
    left: 10px;
  }

  .btn-right {
    right: 10px;
  }

  .container {
    position: relative;
    min-width: 500px;
    width: 100%;
  }

  .btn,
  .card {
    box-shadow: 1px 5px 5px -2px hsl(270deg 60% 50%);
  }
</style>

<svelte:window on:resize="{onResize}" />

<div class="container">
  <div
    class="carousel"
    use:onSwipe="{{ useVertical: false }}"
    on:swipe="{handleSwipe}"
  >
    <div
      class="sequence"
      bind:this="{sequence}"
      style:--sequence__transform="translateX(-{translateX}px)"
    >
      {#each cards as card, i (i)}
        <span
          class="card"
          data-id="{i}"
          title="{cards.length && cards[i].dataset?.id}">{card}</span
        >
      {/each}
    </div>
  </div>
  <button
    type="button"
    class="btn btn-left"
    >&leftarrow;
  </button>
  <button
    type="button"
    class="btn btn-right"
    >&rightarrow;
  </button>
</div>
