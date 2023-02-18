<script>
  import { getContext, createEventDispatcher } from 'svelte';
  // 	import Icon from "/design-system/components/Icon.svelte";

  let opts = getContext('Carousel.ArrowButton:opts') || {};
  let variant = getContext('env.variant');
  let isDimensionUI = true; //todo getContext("display.enableDimensionUI");

  const dispatch = createEventDispatcher();

  export let side;
  export let offset = 0;
  export let yOffset = 0;
  export let backgroundColor = opts.backgroundColor || '#f5f5f5';
  export let strokeColor = opts.strokeColor || 'rgba(0, 0, 0)';
  export let style = opts.style || '';
  export let shouldHide = false;
  export let isOffscreen = false;
  export let isSlideOutOpen = false;

  let showArrowsMnM = getContext('display.showArrowsMnM');
  let isMobileView = getContext('browser.isTouchEnabled');
  $: sideBasedAriaLabel = side === 'right' ? 'next' : 'previous';

  function handleClick() {
    dispatch('clickArrow', { side });
  }
</script>

<style>
  .stylitics-arrow-btn {
    position: absolute;
    width: 44px;
    height: 44px;
    background-color: var(--background-color);
    justify-content: center;
    border-radius: 50%;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    font-weight: 300;
    font-size: 60px;
    display: flex;
    top: calc(50% + var(--y-offset));
    transform: translateY(-50%);
    padding: 0;
    border: none;
    z-index: 1;
  }
  .stylitics-next,
  .stylitics-mnm-next {
    transform: translateY(-50%);
  }
  .stylitics-previous,
  .stylitics-mnm-previous {
    transform: translateY(-50%);
  }
  .stylitics-previous .stylitics-arrow,
  .stylitics-mnm-previous .stylitics-arrow {
    transform: rotate(180deg);
    margin-left: 0;
    margin-right: 3px;
  }
  .stylitics-arrow {
    width: 8px;
    height: 15px;
    overflow: visible;
    margin-left: 3px;
    z-index: 1;
  }
  .stylitics-arrow-btn:hover {
    opacity: 0.5;
  }
  .stylitics-dimension-arrow {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border: 1px solid rgba(33, 33, 33, 0.12);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
  }
  .stylitics-dimension-arrow.stylitics-dimension-carousel-inner {
    top: unset;
    bottom: -12px;
    border: none;
    box-shadow: none;
  }
</style>

<button
  on:focus
  on:blur
  on:click|stopPropagation="{handleClick}"
  class="stylitics-arrow-btn"
  class:stylitics-next="{!showArrowsMnM && side === 'right'}"
  class:stylitics-previous="{!showArrowsMnM && side === 'left'}"
  class:stylitics-mnm-next="{showArrowsMnM && side === 'right'}"
  class:stylitics-mnm-previous="{showArrowsMnM && side === 'left'}"
  class:stylitics-dimension-arrow="{isDimensionUI}"
  class:stylitics-dimension-carousel-inner="{isDimensionUI && isSlideOutOpen && !isMobileView}"
  aria-label="{sideBasedAriaLabel}"
  data-keyboard-navigation-arrow="{side}"
  style="{offset};
         {style};
         z-index: {shouldHide ? -100 : 1};
         --background-color: {variant === 'Nike' ? '#ffffff' : backgroundColor};
         --y-offset:{yOffset}px;"
  tabindex="{isOffscreen ? -1 : 0}"
>
  <svg
    viewbox="0 0 9 16"
    xmlns="http://www.w3.org/2000/svg"
    class="stylitics-arrow"
  >
    <path
      d="M0,0 L9,8 L0,16"
      style="fill: none; stroke-width: 2; stroke: {strokeColor}; stroke-linecap: butt; stroke-linejoin: miter;"></path>
  </svg>
</button>
