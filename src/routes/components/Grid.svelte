<script>
	import { flip } from 'svelte/animate';
	import QuarterDND from './QuarterDND.svelte';
	import { years, quarters, courseTable, prefs } from '../stores.js';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';

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
</script>

<section style={sectionStyle()}>
	{#each $courseTable as year, y (year.id)}
		<div class="yearAndCollapseButtonContainer" in:fly={{ y: 200, duration: 300, delay: y * 300 }}>
			<button
				on:click={() => {
					$prefs.courseTableData.yearsCollapsed[year.id] =
						!$prefs.courseTableData.yearsCollapsed[year.id];
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
			{:else}
				<div class="hiddenNotif">
					{year.id} year hidden
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
	.hiddenNotif {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		border: 2px solid;
		font-size: 1.5em;
	}
</style>
