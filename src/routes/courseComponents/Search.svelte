<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { allCourses, searchResults } from '../stores.js';
	import Course from './Course.svelte';
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		$searchResults = e.detail.items;
	}
	function handleDndFinalize(e) {
		$searchResults = e.detail.items;
	}
	function SearchResults(event) {
		let query = event.target.value;
		let results = $allCourses.filter((course) => course.Description.includes(query)).slice(0, 10);
		$searchResults = results;
	}
</script>

<input type="text" placeholder="Search for a course" on:input={SearchResults} />
<section
	use:dndzone={{ items: $searchResults, flipDurationMs }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each $searchResults as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<Course course={item} />
		</div>
	{/each}
</section>
