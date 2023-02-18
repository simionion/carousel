<script>
  export let data;
  export let width;
  export let height;
  export let gutterWidth;
  export let spacingY;
  export let useFlip = false;
  export let onclick;
  let cardEl, useExtend;

  let isFlipped = false;
  //   $: useExtend = !useFlip;
  let isExtended = false;

  let spacingX = gutterWidth;

  function handleClick() {
    if (useFlip) isFlipped = !isFlipped;
    if (useExtend) isExtended = !isExtended;
  }
</script>

<style>
  .card {
    box-sizing: border-box;
    width: var(--card-width);
    height: var(--card-height);
    margin-left: var(--card-spacing-x);
    margin-block: var(--card-spacing-y);
    transition: all 0.3s ease;
  }

  .card-extended {
    width: calc(2 * var(--card-width));
  }

  /* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
  .flip-card {
    background-color: transparent;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }

  /* This container is needed to position the front and back side */
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  /* Do an horizontal flip when you move the mouse over the flip box container */
  .flip-card-inner-flipped {
    transform: rotateY(180deg);
  }

  /* Position the front and back side */
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  /* Style the front side (fallback if image is missing) */
  .flip-card-front {
    background-color: #bbb;
    color: black;
  }

  /* Style the back side */
  .flip-card-back {
    background-color: dodgerblue;
    color: white;
    transform: rotateY(180deg);
  }

  img {
    width: 100%;
    max-height: 100%;
    max-width: var(--card-width);
  }
</style>

<div
  class="card"
  style:--card-width="{width ?? 300}px"
  style:--card-height="{height ?? 400}px"
  style:--card-spacing-x="{spacingX}px"
  style:--card-spacing-y="{spacingY}px"
  class:card-extended="{useExtend && isExtended}"
  on:click="{onclick}"
  on:keypress="{onclick}"
>
  <div
    class="flip-card"
    on:click="{handleClick}"
    on:keypress="{handleClick}"
    bind:this="{cardEl}"
  >
    <div
      class="flip-card-inner"
      class:flip-card-inner-flipped="{useFlip && isFlipped}"
    >
      <div class="flip-card-front">
        <img
          src="{data.url}"
          alt="{data.title}"
        />
        <span>{data.index}</span>
      </div>
      <div class="flip-card-back">
        <h1>{data.id}</h1>
      </div>
    </div>
  </div>
</div>
