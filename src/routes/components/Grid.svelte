<script>
	import QuarterDND from './QuarterDND.svelte';
	import { years, quarters, courseTable, panelCollapsed, prefs } from '../stores.js';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import PanelCollapseContainer from './PanelCollapseContainer.svelte';
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
	let rowStyle = '';
	$: {
		rowStyle =
			'grid-template-columns: repeat(' +
			($quarters.length - ($panelCollapsed.summer ? 1 : 0)) +
			', minmax(0, 1fr))';
	}
</script>

<section style={sectionStyle()}>
	{#each $courseTable as year, y (year.id)}
		<div class="yearAndCollapseButtonContainer">
			<!--in above div: in:fly={{ y: 200, duration: 300, delay: y * 300 }} -->
			<button
				on:click={() => {
					$panelCollapsed.years[year.id] = !$panelCollapsed.years[year.id];
					const scrollPosition = document.scrollingElement.scrollTop;
					tick().then(() => {
						document.scrollingElement.scrollTop = scrollPosition;
					});
				}}
			>
				{#if $panelCollapsed.years[year.id]}
					<ChevronsUpDown />
				{:else}
					<ChevronsDownUp />
				{/if}
			</button>
			{#if !$panelCollapsed.years[year.id]}
				<div class="yearContainer" style={rowStyle}>
					{#each year.quarters as quarter, q (quarter.id)}
						{#if !$panelCollapsed.summer || !quarter.id.includes('Summer')}
							<div class="quarterContainer">
								<QuarterDND {quarter} {y} {q} />
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="hiddenNotif">
					{year.id} year
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
		align-items: center;
		justify-content: center;
		width: 1.3em;
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
