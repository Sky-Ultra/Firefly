<script lang="ts">
// Adapted from fqzlr/shirone-fq Slider.svelte (MIT; LICENSES/Shirone-fq.txt).
let {
	value,
	min = 0,
	max = 100,
	step = 1,
	label,
	onValueChange,
}: {
	value: number;
	min?: number;
	max?: number;
	step?: number;
	label: string;
	onValueChange: (value: number) => void;
} = $props();
</script>

<div class="fairytale-slider-wrap">
	<input class="fairytale-slider" type="range" {min} {max} {step} {value} aria-label={label}
		oninput={(event) => onValueChange(Number(event.currentTarget.value))} />
</div>

<style>
.fairytale-slider-wrap { height:1.5rem; padding:0 .25rem; border-radius:.25rem; background-image:var(--color-selection-bar,linear-gradient(to right,oklch(.8 .1 0),oklch(.8 .1 30),oklch(.8 .1 60),oklch(.8 .1 90),oklch(.8 .1 120),oklch(.8 .1 150),oklch(.8 .1 180),oklch(.8 .1 210),oklch(.8 .1 240),oklch(.8 .1 270),oklch(.8 .1 300),oklch(.8 .1 330),oklch(.8 .1 360))); user-select:none; }
:global(#display-setting.fairytale-controls-open) .fairytale-slider { -webkit-appearance:none!important; appearance:none!important; width:100%; height:1.5rem!important; margin:0; background:transparent!important; border-radius:0!important; cursor:pointer; }
:global(#display-setting.fairytale-controls-open) .fairytale-slider::-webkit-slider-thumb { -webkit-appearance:none!important; appearance:none!important; height:1rem!important; width:.5rem!important; border:0!important; border-radius:.125rem!important; background:rgb(255 255 255 / 70%)!important; box-shadow:0 0 0 1px color-mix(in oklab,var(--ft-text) 35%,transparent)!important; }
:global(#display-setting.fairytale-controls-open) .fairytale-slider::-moz-range-thumb { height:1rem!important; width:.5rem!important; border:0!important; border-radius:.125rem!important; background:rgb(255 255 255 / 70%)!important; box-shadow:0 0 0 1px color-mix(in oklab,var(--ft-text) 35%,transparent)!important; }
:global(#display-setting.fairytale-controls-open) .fairytale-slider:focus-visible { outline:2px solid var(--primary); outline-offset:2px; }
</style>
