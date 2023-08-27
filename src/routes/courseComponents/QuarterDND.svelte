<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, courseTable, searchResults } from '../stores.js';
	import Course from '../courseComponents/Course.svelte';

	export let quarter;
	export let y;
	export let q;

	const flipDurationMs = 200;

	function handleDndConsider(e, y, q) {
		$courseTable[y].quarters[q].courses = e.detail.items;
	}
	function handleDndFinalize(e, yearId, quarterId) {
		handleDndConsider(e, yearId, quarterId);
	}
</script>

<div
	class="courseDndList"
	use:dndzone={{ items: quarter.courses, flipDurationMs }}
	on:consider={(e) => handleDndConsider(e, y, q)}
	on:finalize={(e) => handleDndFinalize(e, y, q)}
>
	{#each quarter.courses as course (course.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Course {course} />
		</div>
	{/each}
</div>

<style>
	.courseDndList {
		display: flex;
		flex-direction: column;
		min-height: 8em;
	}
</style>
