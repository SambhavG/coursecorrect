<script>
	import QuarterDND from './QuarterDND.svelte';
	import { years, quarters, courseTable, prefs } from '../stores.js';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';

	let gridChangeThreshold = 1000;
	let width = 1400;
	if (typeof window !== 'undefined') {
		width = document.body.clientWidth;
		window.addEventListener('resize', () => {
			width = document.body.clientWidth;
		});
	}

	function sectionStyle() {
		return 'grid-template-rows: repeat(' + $years.length + ', 1fr)';
	}
	function rowStyle() {
		return 'grid-template-columns: repeat(' + $quarters.length + ', 1fr)';
	}
	$: {
		console.log($prefs.courseTableData.yearsCollapsed);
	}
</script>

<section style={sectionStyle()}>
	{#each $courseTable as year, y (year.id)}
		<div class="yearAndCollapseButtonContainer">
			<button
				on:click={() => {
					$prefs.courseTableData.yearsCollapsed[year.id] =
						!$prefs.courseTableData.yearsCollapsed[year.id];
					console.log($prefs.courseTableData.yearsCollapsed);
				}}
			>
				{#if $prefs.courseTableData.yearsCollapsed[year.id]}
					<ChevronsUpDown />
				{:else}
					<ChevronsDownUp />
				{/if}
			</button>
			{#if !$prefs.courseTableData.yearsCollapsed[year.id]}
				<div class="yearContainer" style={rowStyle()}>
					{#each year.quarters as quarter, q (quarter.id)}
						<div class="quarterContainer">
							<QuarterDND {quarter} {y} {q} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</section>

<style>
	section {
		width: 100%;
	}
	.yearAndCollapseButtonContainer {
		display: flex;
		flex-direction: row;
	}
	button {
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border: none;
		border: 2px solid;
		padding: 0;
	}
	.yearContainer {
		display: grid;
		min-height: 8em;
	}
	.quarterContainer {
		padding: 0.5em 0.5em;
		border: 2px solid;
	}
</style>
