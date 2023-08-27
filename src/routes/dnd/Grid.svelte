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
		padding: 0.3em;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
	}
	.yearContainer {
		display: flex;
		flex-direction: row;
		min-height: 8em;
	}
	.quarterContainer {
		margin: 0.02em;
		border: 0.01em solid gray;
	}
</style>
