<script>
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { panelCollapsed } from '../stores';
	import { tick } from 'svelte';

	export let panelId;
	export let panelName;
	export let content;
	export let props = {};
</script>

<section>
	<button
		class="switchPanelButton"
		on:click={() => {
			$panelCollapsed[panelId] = !$panelCollapsed[panelId];
			const scrollPosition = document.scrollingElement.scrollTop;
			tick().then(() => {
				document.scrollingElement.scrollTop = scrollPosition;
			});
		}}
	>
		{#if $panelCollapsed[panelId]}
			<ChevronsUpDown />
		{:else}
			<ChevronsDownUp />
		{/if}
	</button>
	{#if !$panelCollapsed[panelId]}
		<svelte:component this={content} {...props} />
	{:else}
		<div class="hiddenNotif">{panelName} hidden</div>
	{/if}
</section>

<style>
	section {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border: 0.25em solid var(--color-text-light);
	}
	.switchPanelButton {
		all: unset;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-style: none;
		border-right: 0.25em solid;
		padding: 0;
		width: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
