<script>
  export let totalDots = 0;
  export let activeIndex = 0;
  export let onClick;
</script>

<style>
  .dots {
    display: flex;
    width: 100%;
    align-self: center;
    justify-content: center;
  }

  .square {
    all: unset;
    width: 44px;
    height: 44px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .dot {
    width: 6px;
    height: 6px;
    border: 1px solid black;
    border-radius: 50%;
  }

  .active {
    background-color: black;
  }
</style>

{#if totalDots > 1}
  <div class="dots">
    {#each Array.from({ length: totalDots }) as dot, index}
      <button
        type="button"
        class="square"
        on:click="{() => onClick?.(index)}"
        on:keypress="{() => onClick?.(index)}"
      >
        <span
          class="dot"
          class:active="{index == activeIndex}"></span>
      </button>
    {/each}
  </div>
{/if}
