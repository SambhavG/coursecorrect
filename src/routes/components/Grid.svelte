<script>
	import QuarterDND from './QuarterDND.svelte';
	import { years, quarters, courseTable, prefs } from '../stores.js';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { tick } from 'svelte';

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
		return 'grid-template-columns: repeat(' + $quarters.length + ', minmax(0, 1fr))';
	}
</script>

<section style={sectionStyle()}>
	{#each $courseTable as year, y (year.id)}
		<div class="yearAndCollapseButtonContainer" in:fly={{ y: 200, duration: 300, delay: y * 300 }}>
			<button
				on:click={() => {
					$prefs.panelCollapsed.years[year.id] = !$prefs.panelCollapsed.years[year.id];
					const scrollPosition = document.scrollingElement.scrollTop;
					tick().then(() => {
						document.scrollingElement.scrollTop = scrollPosition;
					});
				}}
			>
				{#if $prefs.panelCollapsed.years[year.id]}
					<ChevronsUpDown />
				{:else}
					<ChevronsDownUp />
				{/if}
			</button>
			{#if !$prefs.panelCollapsed.years[year.id]}
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
		border: 0.25em solid;
	}
	/* all but last don't have bottom border */
	.yearAndCollapseButtonContainer:not(:last-child) {
		border-bottom: none;
	}
	button {
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-style: none;
		border-right: 0.25em solid;
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.yearContainer {
		display: grid;
		min-height: 20em;
		width: 100%;
	}
	.quarterContainer {
		padding: 0.5em 0.5em;
	}
	/* apply to all but last quarterContainer */
	.quarterContainer:not(:last-child) {
		border-right: 0.25em solid;
	}

	.hiddenNotif {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		font-size: 1.5em;
	}
</style>
