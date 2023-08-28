<script>
	import QuarterDND from './../courseComponents/QuarterDND.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, courseTable, searchResults } from '../stores.js';
	import QuarterDnd from '../courseComponents/QuarterDND.svelte';
</script>

<section>
	{#each $courseTable as year, y (year.id)}
		<div class="yearContainer">
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
		border: 2px solid;
		display: flex;
		flex-direction: column;
	}
	.yearContainer {
		display: flex;
		flex-direction: row;
		min-height: 8em;
	}
	.quarterContainer {
		padding: 0.5em 0.5em;
		width: 100%;
		border: 2px solid;
	}
</style>
