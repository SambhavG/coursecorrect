<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { allCourses, searchResults, searchFilters } from '../stores.js';
	import Course from './Course.svelte';

	let showFilters = false;
	let query = '';
	let resultCategories = [
		{
			type: 'exactMatchResults',
			title: 'Exact Match',
			show: true,
			numResults: 25
		},
		{
			type: 'sameDepartmentResults',
			title: 'Same Department',
			show: true,
			numResults: 10000
		},
		{
			type: 'titleResults',
			title: 'Title Match',
			show: true,
			numResults: 25
		},
		{
			type: 'descriptionResults',
			title: 'Description Match',
			show: true,
			numResults: 25
		}
	];

	let allDepartmentCodes = [];

	function toggleShowFilters() {
		showFilters = !showFilters;
	}

	function doesCourseFitFilters(course, filters) {
		//Check if units filter is active
		let unitsFilterActive = false;
		Object.keys(filters.Units).forEach((unit) => {
			if (filters.Units[unit]) {
				unitsFilterActive = true;
			}
		});

		//Check if course fits units filter
		if (unitsFilterActive) {
			let unitsTaking = parseInt(course.unitsTaking);
			let unitsFilterFits = false;
			Object.keys(filters.Units).forEach((unit) => {
				if (filters.Units[unit] && unit == '6+' && unitsTaking >= 6) {
					unitsFilterFits = true;
				} else if (filters.Units[unit] && unitsTaking == parseInt(unit)) {
					unitsFilterFits = true;
				}
			});
			if (!unitsFilterFits) {
				return false;
			}
		}

		//Check if WAYS filter is active
		let waysFilterActive = false;
		Object.keys(filters.WAYS).forEach((way) => {
			if (filters.WAYS[way]) {
				waysFilterActive = true;
			}
		});

		//Check if course fits WAYS filter
		if (waysFilterActive) {
			let waysFilterFits = false;
			Object.keys(filters.WAYS).forEach((way) => {
				if (filters.WAYS[way] && course.WAYS.includes(way)) {
					waysFilterFits = true;
				}
			});
			if (!waysFilterFits) {
				return false;
			}
		}

		return true;
	}

	const flipDurationMs = 300;
	function handleDndConsider(e, type) {
		$searchResults[type] = e.detail.items;
	}
	function handleDndFinalize(e, type) {
		$searchResults[type] = e.detail.items;
	}
	function randomizeId(course) {
		return {
			...course,
			id: course.id.split('|')[0] + '|' + Math.random().toString(36).substring(7)
		};
	}
	// function searchResultsFunction() {
	// 	$searchResults = {
	// 		exactMatchResults: [],
	// 		sameDepartmentResults: [],
	// 		titleResults: [],
	// 		descriptionResults: []
	// 	};
	// }
	function searchResultsFunction() {
		let queryUpper = query.toUpperCase().trim();
		let queryLower = query.toLowerCase().trim();
		let workingList = $allCourses.filter((course) => doesCourseFitFilters(course, $searchFilters));

		let exactMatchResults = [];
		let sameDepartmentResults = [];
		let titleResults = [];
		let descriptionResults = [];
		//We want this logic to be smart
		//If the user types in just the department code, we want to show all courses in that department

		//Empty search
		if (query == '') {
			$searchResults = {
				exactMatchResults,
				sameDepartmentResults,
				titleResults,
				descriptionResults
			};
			return;
		}

		//All courses
		if (query == '%') {
			queryUpper = '';
			queryLower = '';
		}

		//Build list of all department codes
		$allCourses.forEach((course) => {
			if (!allDepartmentCodes.includes(course.Class.split(' ')[0])) {
				allDepartmentCodes.push(course.Class.split(' ')[0]);
			}
		});
		allDepartmentCodes.sort();

		//Check if query is a department code
		let isDepartment = allDepartmentCodes.includes(queryUpper);

		//Get numResults value corresponding to each category
		let numResults = {};
		resultCategories.forEach((category) => {
			numResults[category.type] = category.numResults;
		});

		if (isDepartment) {
			//Filter to department and return
			sameDepartmentResults = workingList
				.filter((course) => course.Class.split(' ')[0] == queryUpper)
				.slice(0, numResults.sameDepartmentResults)
				.map(randomizeId);
			$searchResults = {
				exactMatchResults,
				sameDepartmentResults,
				titleResults,
				descriptionResults
			};
			return;
		}
		//Otherwise, filter to courses that fit filters
		//We want results for exact match with class, then exact department, then match title, then match description

		exactMatchResults = workingList
			.filter((course) => course.Class.toLowerCase().includes(queryLower))
			.slice(0, numResults.exactMatchResults);

		titleResults = workingList
			.filter((course) => !exactMatchResults.includes(course))
			.filter((course) => course.Name.toLowerCase().includes(queryLower))
			.slice(0, numResults.titleResults);

		descriptionResults = workingList
			.filter((course) => !exactMatchResults.includes(course))
			.filter((course) => !titleResults.includes(course))
			.filter((course) => course.Description.includes(queryLower))
			.slice(0, numResults.descriptionResults);

		exactMatchResults = exactMatchResults.map(randomizeId);
		titleResults = titleResults.map(randomizeId);
		descriptionResults = descriptionResults.map(randomizeId);

		$searchResults = {
			exactMatchResults,
			sameDepartmentResults,
			titleResults,
			descriptionResults
		};
	}

	$: {
		searchResultsFunction();
		$searchFilters = $searchFilters;
	}
</script>

<section>
	<div class="inputContainer">
		<input
			type="text"
			placeholder="% for all courses"
			bind:value={query}
			on:input={searchResultsFunction}
		/>

		<button class="filtersHeader" on:click={toggleShowFilters}> Filters </button>
	</div>
	{#if showFilters}
		<div class="filtersPanel">
			<div class="filters">
				<div class="filter">
					<div class="title">Units</div>
					<div class="options">
						{#each Object.keys($searchFilters.Units) as unit}
							<div class="option">
								<input
									type="checkbox"
									id={unit}
									name={unit}
									on:click={searchResultsFunction}
									bind:checked={$searchFilters.Units[unit]}
								/>
								<label for={unit}>{unit}</label>
							</div>
						{/each}
					</div>
				</div>
				<div class="filter">
					<div class="title">WAYS</div>
					<div class="options">
						{#each Object.keys($searchFilters.WAYS) as way}
							<div class="option">
								<input
									type="checkbox"
									id={way}
									name={way}
									on:click={searchResultsFunction}
									bind:checked={$searchFilters.WAYS[way]}
								/>
								<label for={way}>{way}</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#each resultCategories as category}
		{#if $searchResults && $searchResults[category.type] && $searchResults[category.type]?.length != 0}
			<div class="resultsHeader {category.type}header">
				<div class="horizontalLine" />
				{category.title}
				<div class="horizontalLine" />
			</div>
			<div
				class="results {category.type}"
				use:dndzone={{ items: $searchResults[category.type], flipDurationMs }}
				on:consider={(e) => handleDndConsider(e, category.type)}
				on:finalize={(e) => handleDndFinalize(e, category.type)}
			>
				{#each $searchResults[category.type] as item (item.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<Course course={item} showDescription={false} />
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</section>

<style>
	section {
		box-sizing: border-box;
	}

	.inputContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	input {
		box-sizing: border-box;
		flex-grow: 1;
		font-size: 1.2em;
		height: 1.8em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.filtersHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.resultsHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		font-size: 1.2em;
		margin: 0.5em 0;
	}
	.horizontalLine {
		flex-grow: 1;
		height: 1px;
		background-color: #ccc;
	}

	.results {
		max-height: 16em;
		overflow: auto;
	}

	.filtersPanel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		margin-top: 0.5em;
		margin-bottom: 0.3em;
		padding: 0.5em;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.filters {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		padding: 0.5em;
	}

	.filter {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 0.5em;
	}

	.title {
		font-weight: bold;
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
	}

	.options {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
	}

	.option {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
