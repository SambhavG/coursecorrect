<script>
	import { searchFilters } from './../stores.js';
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
		return course.id.split('|')[0] + '|' + Math.random().toString(36).substring(7);
	}
	function SearchResults(event) {
		let query = event.target.value;

		//Get list of courses which match search filters
		let workingList = $allCourses;
		Object.keys($searchFilters).forEach((key) => {
			let filters = $searchFilters[key];
			let foundPos = false;
			Object.keys(filters).forEach((filter) => {
				if (filters[filter]) {
					foundPos = true;
				}
			});
			if (foundPos) {
				Object.keys(filters).forEach((filter) => {
					if (key == 'WAYS' && !filters[filter]) {
						workingList = workingList.filter(
							(course) => course['WAYS 1'] != filter && course['WAYS 2'] != filter
						);
					}
					if (key == 'Units' && !filters[filter]) {
						if (filter != '6+') {
							workingList = workingList.filter(
								(course) => course['Units Ceiling'] != parseInt(filter)
							);
						} else {
							workingList = workingList.filter((course) => course['Units Ceiling'] < 6);
						}
					}
				});
			}
		});

		//We want results for exact match with class, then exact department, then match title, then match description

		// let results = $allCourses.filter((course) => course.Description.includes(query) || course.Name.includes(query)).slice(0, 100);
		let exactMatchResults = workingList
			.filter((course) => course.Class.includes(query))
			.slice(0, 10);
		let titleResults = workingList
			.filter((course) => !course.Class.includes(query) && course.Name.includes(query))
			.slice(0, 100);
		let descriptionResults = workingList
			.filter(
				(course) =>
					!course.Class.includes(query) &&
					!course.Name.includes(query) &&
					course.Description.includes(query)
			)
			.slice(0, 100);
		let results = exactMatchResults.concat(titleResults).concat(descriptionResults);

		for (let i = 0; i < results.length; i++) {
			results[i].id = randomizeId(results[i]);
		}
		$searchResults = results;
	}
</script>

<section>
	<input type="text" placeholder="Search for a course" on:input={SearchResults} />

	<div
		class="results"
		use:dndzone={{ items: $searchResults, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each $searchResults as item (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<Course course={item} showDescription={false} />
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		box-sizing: border-box;
	}
	input {
		box-sizing: border-box;
		width: 100%;
		height: 1.8em;
		padding-left: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.results {
		max-height: 35em;
		overflow: auto;
	}
</style>
