<script>
	import { isDragging } from './../stores.js';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Course from './Course.svelte';
	import { Trash2 } from 'lucide-svelte';
	let items = [];
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		items = e.detail.items;
		$isDragging = true;
	}
	function handleDndFinalize(e) {
		items = [];
		$isDragging = false;
	}
</script>

{#if $isDragging}
	<section>
		<div class="trashIcon">
			<Trash2 size="15em" />
		</div>
		<div
			class="dndzone"
			use:dndzone={{ items, flipDurationMs, dropTargetStyle: {} }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each items as item (item.id)}
				<div animate:flip={{ duration: flipDurationMs }}>
					<Course course={item} />
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	section {
		width: 15em;
		height: 15em;
		position: relative;
	}
	section > * {
		position: absolute;
		top: -50%;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
