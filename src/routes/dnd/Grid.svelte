<script>
	import QuarterDND from './../courseComponents/QuarterDND.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, courseTable, searchResults } from '../stores.js';
	import QuarterDnd from '../courseComponents/QuarterDND.svelte';

	let width = 1400;
	if (typeof window !== 'undefined') {
		width = document.body.clientWidth;
		window.addEventListener('resize', () => {
			width = document.body.clientWidth;
		});
	}
</script>

<section>
	{#each $courseTable as year, y (year.id)}
		<div class={width >= 1400 ? 'yearContainer' : 'stackedYearContainer'}>
			{#each year.quarters as quarter, q (quarter.id)}
				<div class="quarterContainer">
					<QuarterDND {quarter} {y} {q} />
				</div>
			{/each}
		</div>
	{/each}
</section>

<style>
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.yearContainer {
		display: flex;
		flex-direction: row;
		min-height: 8em;
	}
	.stackedYearContainer {
		display: flex;
		flex-direction: column;
		min-height: 8em;
	}

	.quarterContainer {
		padding: 0.5em 0.5em;
		border: 2px solid;
	}
</style>
