<script lang="ts">
  import Slider from '@smui/slider';
  export let value: number;
  export let name: string;
  export let typeEffect: boolean = true;
</script>

<p>
  {name.toUpperCase()} {value} {#if typeEffect}+2{/if}
  <Slider bind:value={value} min={1} max={17} step={1}></Slider>
</p>