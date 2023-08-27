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
	function randomizeId(course) {
		//console.log(course.id.split('|')[0] + '|' + Math.random().toString(36).substring(7))
		return course.id.split('|')[0] + '|' + Math.random().toString(36).substring(7);
	}
	function SearchResults(event) {
		let query = event.target.value;
		let results = $allCourses
			.filter((course) => course.Description.includes(query))
			.slice(0, 10);
		for (let i = 0; i < results.length; i++) {
			results[i].id = randomizeId(results[i]);
		}
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
