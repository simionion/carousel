<script>
  import { getContext } from 'svelte';
  import Dots from './Dots.svelte';
  import DimensionCarousel from './DimensionCarousel.svelte';
  import DimensionBundleCard from './Card.svelte';

  let cards = [
    {
      'albumId': 1,
      'id': 1,
      'title': 'accusamus beatae ad facilis cum similique qui sunt',
      'url': 'https://api.lorem.space/image/movie?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 2,
      'title': 'reprehenderit est deserunt velit ipsam',
      'url': 'https://api.lorem.space/image/book?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 3,
      'title': 'officia porro iure quia iusto qui ipsa ut modi',
      'url': 'https://api.lorem.space/image/game?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 4,
      'title': 'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
      'url': 'https://api.lorem.space/image/album?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 5,
      'title': 'natus nisi omnis corporis facere molestiae rerum in',
      'url': 'https://api.lorem.space/image/face?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 6,
      'title': 'accusamus ea aliquid et amet sequi nemo',
      'url': 'https://api.lorem.space/image/fashion?w=300&h=400',
    },
    {
      'albumId': 1,
      'id': 7,
      'title': 'officia delectus consequatur vero aut veniam explicabo molestias',
      'url': 'https://api.lorem.space/image/drink?w=300&h=400',
    },
  ];

  export const bundles = cards;
  export let columnCount = 3;

  //safe from here down:

  export let bundlesCount;
  export let cardAspectRatio = 1.4;
  export let gutterWidth = getContext('bundleGutterWidth') || 20;
  export let arrowsOffset = 10;

  let isExtended = false;

  let carouselSlideLeft;
  let carouselSlideRight;
  let outerCarouselIndex;
  let carouselCardWidth;
  let carouselSlideTo;
</script>

<DimensionCarousel
  maxIndex="{cards.length - 1}"
  bundlesCount="{bundlesCount}"
  cardAspectRatio="{cardAspectRatio}"
  columnCount="{columnCount}"
  gutterWidth="{gutterWidth}"
  arrowsOffset="{arrowsOffset}"
  isExtended="{isExtended}"
  startIndex="{0}"
  let:cardWidth
  bind:cardWidth="{carouselCardWidth}"
  let:carouselIndex
  bind:carouselIndex="{outerCarouselIndex}"
  let:fnSlideTo
  bind:fnSlideTo="{carouselSlideTo}"
  let:fnSlideLeft
  bind:fnSlideLeft="{carouselSlideLeft}"
  let:fnSlideRight
  bind:fnSlideRight="{carouselSlideRight}"
>
  {#each cards.concat(cards.length - 2 < columnCount ? cards : []) as card, index (index)}
    <DimensionBundleCard
      data="{{ ...card, index }}"
      columnCount="{columnCount}"
      isExtended="{isExtended}"
      bundlesCount="{bundlesCount}"
      gutterWidth="{gutterWidth}"
      width="{cardWidth}"
      height="{cardWidth * cardAspectRatio}"
      onclick="{e => {
        isExtended = !isExtended;
        fnSlideTo(index % cards.length, true);
      }}"
    />
  {/each}
</DimensionCarousel>

<!-- Don't copy this bellow

{#if isExtended}
  <DimensionSlideOut
    onclick={() => isExtended = !isExtended}
    onLeftArrow={carouselSlideLeft}
    onRightArrow={carouselSlideRight}
    {cardAspectRatio}
    width={carouselCardWidth}
    {gutterWidth}
    {columnCount}
    {bundlesCount}
    data={bundles?.[outerCarouselIndex] || bundles?.[outerCarouselIndex % cards.length]} />
{/if}




 -->
<Dots
  totalDots="{cards.length}"
  activeIndex="{outerCarouselIndex}"
  onClick="{i => carouselSlideTo(i, false)}"
/>
