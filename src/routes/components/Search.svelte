<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { allCourses, searchFilters, isDragging, courseTableList } from '../stores.js';
	import Course from './Course.svelte';
	import { listOfCourseObjsIncludesCode } from '../utils/utils.js';
	import { resultCategories } from '../stores.js';
	import { tick } from 'svelte';

	let showFilters = false;
	let query = '%';

	function doesCourseFitFilters(course, filters) {
		//Check if meta filterGridCourses is active and filter if so
		if (filters.meta.filterGridCourses && listOfCourseObjsIncludesCode($courseTableList, course)) {
			return false;
		}

		//Check if meta filterNotOffered is active and filter if so
		if (filters.meta.filterNotOffered && course.seasons_offered.length == 0) {
			return false;
		}

		//Check if units filter is active
		let unitsFilterActive = false;
		Object.keys(filters.units).forEach((unit) => {
			if (filters.units[unit]) {
				unitsFilterActive = true;
			}
		});

		//Check if course fits units filter
		if (unitsFilterActive) {
			let units_taking = parseInt(course.units_taking);
			let unitsFilterFits = false;
			Object.keys(filters.units).forEach((unit) => {
				if (filters.units[unit] && unit == '6+' && units_taking >= 6) {
					unitsFilterFits = true;
				} else if (filters.units[unit] && units_taking == parseInt(unit)) {
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
				if (filters.WAYS[way] && course.ways.includes(way)) {
					waysFilterFits = true;
				}
			});
			if (!waysFilterFits) {
				return false;
			}
		}

		//Check if course fits hours filter
		if (filters.hours.min != '' && course.int_hours < filters.hours.min) {
			return false;
		}
		if (filters.hours.max != '' && course.int_hours > filters.hours.max) {
			return false;
		}

		//Check if course fits eval filter
		if (course.average_rating != '-1') {
			if (filters.averageEval.min != '' && course.average_rating < filters.averageEval.min) {
				return false;
			}
			if (filters.averageEval.max != '' && course.average_rating > filters.averageEval.max) {
				return false;
			}
		}

		//Check if course fits percent completed filter
		if (
			filters.percentCompleted.min != '' &&
			course.percent_outcomes_completed < filters.percentCompleted.min
		) {
			return false;
		}
		if (
			filters.percentCompleted.max != '' &&
			course.percent_outcomes_completed > filters.percentCompleted.max
		) {
			return false;
		}

		//Check if quartersOffered filter is active
		let quartersOfferedFilterActive = false;
		Object.keys(filters.QuartersOffered).forEach((quarter) => {
			if (filters.QuartersOffered[quarter]) {
				quartersOfferedFilterActive = true;
			}
		});

		//Check if course fits quartersOffered filter
		if (quartersOfferedFilterActive) {
			let quartersOfferedFilterFits = false;
			Object.keys(filters.QuartersOffered).forEach((quarter) => {
				if (
					filters.QuartersOffered[quarter] &&
					course.seasons_offered.includes(quarter.toLowerCase())
				) {
					quartersOfferedFilterFits = true;
				}
			});
			if (!quartersOfferedFilterFits) {
				return false;
			}
		}

		//Check if degree specific filter is active
		let degreeSpecificFilterActive = false;
		Object.keys(filters.degreeSpecific.checkboxes).forEach((checkbox) => {
			if (filters.degreeSpecific.checkboxes[checkbox]) {
				degreeSpecificFilterActive = true;
			}
		});

		//Check if course fits degree specific filter
		if (degreeSpecificFilterActive) {
			let degreeSpecificFilterFits = false;
			Object.keys(filters.degreeSpecific.luts).forEach((lut) => {
				if (
					filters.degreeSpecific.checkboxes[lut] &&
					filters.degreeSpecific.luts[lut].includes(course.code)
				) {
					degreeSpecificFilterFits = true;
				}
			});
			if (!degreeSpecificFilterFits) {
				return false;
			}
		}

		return true;
	}
	function clearFilters(filter) {
		if (filter == 0) {
			$searchFilters.meta.filterGridCourses = false;
			$searchFilters.meta.filterNotOffered = false;
			for (let i = 0; i < $resultCategories.length; i++) {
				$resultCategories[i].hide = false;
				$resultCategories[i].numResults = $resultCategories[i].defaultNumResults;
			}
		} else if (filter == 1) {
			Object.keys($searchFilters.WAYS).forEach((way) => {
				$searchFilters.WAYS[way] = false;
			});
			Object.keys($searchFilters.units).forEach((unit) => {
				$searchFilters.units[unit] = false;
			});
			Object.keys($searchFilters.QuartersOffered).forEach((quarter) => {
				$searchFilters.QuartersOffered[quarter] = false;
			});
			$searchFilters.hours.min = 0;
			$searchFilters.hours.max = 24;
			$searchFilters.averageEval.min = 0;
			$searchFilters.averageEval.max = 5;
			$searchFilters.percentCompleted.min = 0;
			$searchFilters.percentCompleted.max = 100;
		} else if (filter == 2) {
			Object.keys($searchFilters.degreeSpecific.checkboxes).forEach((checkbox) => {
				$searchFilters.degreeSpecific.checkboxes[checkbox] = false;
			});
		}
	}

	const flipDurationMs = 300;
	let scrollPosition = 0;

	function handleDndConsider(e, type) {
		scrollPosition = document.scrollingElement.scrollTop;
		$resultCategories.forEach((category) => {
			if (category.type == type) {
				category.results = e.detail.items;
			}
		});
		$resultCategories = $resultCategories;
		$isDragging = true;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
	}
	function handleDndFinalize(e, type) {
		scrollPosition = document.scrollingElement.scrollTop;
		$resultCategories.forEach((category) => {
			if (category.type == type) {
				category.results = e.detail.items;
			}
		});
		$resultCategories = $resultCategories;
		$isDragging = false;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
	}
	function randomizeId(course) {
		return {
			...course,
			id: course.id.split('|')[0] + '|' + Math.random().toString(36).substring(7)
		};
	}

	function searchResultsFunction() {
		if (typeof window !== 'undefined') {
			const scrollPosition = document.scrollingElement.scrollTop;
			tick().then(() => {
				document.scrollingElement.scrollTop = scrollPosition;
			});
		}
		let queryUpper = query.toUpperCase().trim();
		let queryLower = query.toLowerCase().trim();
		let workingList = $allCourses.filter((course) => doesCourseFitFilters(course, $searchFilters));

		let exactMatchResults = [];
		let totalExactMatchResults = 0;
		let sameDepartmentResults = [];
		let totalSameDepartmentResults = 0;
		let titleResults = [];
		let totalTitleResults = 0;
		let descriptionResults = [];
		let totalDescriptionResults = 0;

		//Empty search
		if (query == '') {
			$resultCategories.forEach((category) => {
				category.results = [];
			});
			$resultCategories = $resultCategories;
			return;
		}

		//All courses
		if (query == '%') {
			queryUpper = '';
			queryLower = '';
		}

		//Get numResults value corresponding to each category
		let numResults = {};
		let hidden = {};
		$resultCategories.forEach((category) => {
			numResults[category.type] = category.numResults;
			hidden[category.type] = category.hide;
		});

		if (!hidden.sameDepartmentResults) {
			sameDepartmentResults = workingList.filter(
				(course) => course.dept === queryUpper.split(' ')[0]
			);
			totalSameDepartmentResults = sameDepartmentResults.length;
			sameDepartmentResults = sameDepartmentResults.slice(0, numResults.sameDepartmentResults);
		}

		if (!hidden.exactMatchResults) {
			exactMatchResults = workingList.filter((course) => course.code.includes(queryUpper));
			totalExactMatchResults = exactMatchResults.length;
			exactMatchResults = exactMatchResults.slice(0, numResults.exactMatchResults);
		}

		if (!hidden.titleResults) {
			titleResults = workingList
				.filter((course) => !exactMatchResults.includes(course))
				.filter((course) => course.short_title.toLowerCase().includes(queryLower));
			totalTitleResults = titleResults.length;
			titleResults = titleResults.slice(0, numResults.titleResults);
		}

		if (!hidden.descriptionResults) {
			descriptionResults = workingList
				.filter((course) => !exactMatchResults.includes(course))
				.filter((course) => !titleResults.includes(course))
				.filter((course) => course.description.includes(queryLower));
			totalDescriptionResults = descriptionResults.length;
			descriptionResults = descriptionResults.slice(0, numResults.descriptionResults);
		}

		exactMatchResults = exactMatchResults.map(randomizeId);
		sameDepartmentResults = sameDepartmentResults.map(randomizeId);
		titleResults = titleResults.map(randomizeId);
		descriptionResults = descriptionResults.map(randomizeId);

		$resultCategories.forEach((category) => {
			if (category.type == 'exactMatchResults') {
				category.results = exactMatchResults;
				category.numResultsFound = totalExactMatchResults;
				category.numResultsShowing = exactMatchResults.length;
			} else if (category.type == 'sameDepartmentResults') {
				category.results = sameDepartmentResults;
				category.numResultsFound = totalSameDepartmentResults;
				category.numResultsShowing = sameDepartmentResults.length;
			} else if (category.type == 'titleResults') {
				category.results = titleResults;
				category.numResultsFound = totalTitleResults;
				category.numResultsShowing = titleResults.length;
			} else if (category.type == 'descriptionResults') {
				category.results = descriptionResults;
				category.numResultsFound = totalDescriptionResults;
				category.numResultsShowing = descriptionResults.length;
			}
		});
		$resultCategories = $resultCategories;
	}

	$: {
		searchResultsFunction();
		$searchFilters = $searchFilters;
	}

	function checkboxFunction(type) {
		$resultCategories.forEach((category) => {
			if (category.type == type) {
				category.hide = !category.hide;
			}
		});
		$resultCategories = $resultCategories;
		searchResultsFunction();
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

		<button
			class="filtersHeaderButton"
			on:click={() => {
				showFilters = !showFilters;
			}}
		>
			Filters
		</button>
	</div>
	{#if showFilters}
		<div class="filtersMenuContainer">
			<div class="filter">
				<button
					class="clearFilterButton"
					on:click={() => {
						clearFilters(0);
						clearFilters(1);
						clearFilters(2);
						searchResultsFunction();
					}}>Reset all filter settings</button
				>
				<div class="option leftAlign">
					<input
						type="checkbox"
						id="filterGridCourses"
						name="filterGridCourses"
						on:click={searchResultsFunction}
						bind:checked={$searchFilters.meta.filterGridCourses}
					/>
					<label for="filterGridCourses">Hide courses already added to planner</label>
				</div>
				<div class="option leftAlign">
					<input
						type="checkbox"
						id="filterGridCourses"
						name="filterGridCourses"
						on:click={searchResultsFunction}
						bind:checked={$searchFilters.meta.filterNotOffered}
					/>
					<label for="filterGridCourses">Hide courses not offered</label>
				</div>
				<div class="filter">
					<div class="title">Match type settings</div>
					<div class="title">Showing too many courses may slow search</div>
					<div class="filters">
						<div class="filter matchTypeGridFilter">
							{#each $resultCategories as category}
								<div class="option">
									<label for={category.type}>Hide</label>
									<input
										type="checkbox"
										id={category.type}
										name={category.type}
										on:click={() => {
											checkboxFunction(category.type);
											searchResultsFunction();
										}}
										bind:checked={category.hide}
									/>
									<input
										class="numResultsInput"
										type="number"
										id={category.type}
										name={category.type}
										on:change={searchResultsFunction}
										bind:value={category.numResults}
									/>
									<label for={category.type}># results - {category.title.toLowerCase()}</label>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<div class="horizontalLine" />
			<div class="filters">
				<div class="filter">
					<button
						class="clearFilterButton"
						on:click={() => {
							clearFilters(1);
							searchResultsFunction();
						}}>Clear filters</button
					>
					<div class="unitsAndWays">
						<div class="filter">
							<div class="title">Units</div>
							<div class="options">
								{#each Object.keys($searchFilters.units) as unit}
									<div class="option">
										<input
											type="checkbox"
											id={unit}
											name={unit}
											on:click={searchResultsFunction}
											bind:checked={$searchFilters.units[unit]}
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
				<div class="filter">
					<div class="title">Hours</div>
					<div class="fieldOptions">
						Min:
						<input
							type="number"
							id="minHours"
							name="minHours"
							placeholder="Min"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.hours.min}
						/>
						Max:
						<input
							type="number"
							id="maxHours"
							name="maxHours"
							placeholder="Max"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.hours.max}
						/>
					</div>
					<div class="title">Average Eval</div>
					<div class="fieldOptions">
						Min:
						<input
							type="number"
							step=".1"
							id="minEval"
							name="minEval"
							placeholder="Min"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.averageEval.min}
						/>
						Max:
						<input
							type="number"
							step=".1"
							id="maxEval"
							name="maxEval"
							placeholder="Max"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.averageEval.max}
						/>
					</div>
					<div class="title">Percent Completed</div>
					<div class="fieldOptions">
						Min:
						<input
							type="number"
							id="minPercentCompleted"
							name="minPercentCompleted"
							placeholder="Min"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.percentCompleted.min}
						/>
						Max:
						<input
							type="number"
							id="maxPercentCompleted"
							name="maxPercentCompleted"
							placeholder="Max"
							on:input={searchResultsFunction}
							bind:value={$searchFilters.percentCompleted.max}
						/>
					</div>
					<div class="title">Quarters Offered</div>
					<div class="options">
						{#each Object.keys($searchFilters.QuartersOffered) as quarter}
							<div class="option">
								<input
									type="checkbox"
									id={quarter}
									name={quarter}
									on:click={searchResultsFunction}
									bind:checked={$searchFilters.QuartersOffered[quarter]}
								/>
								<label for={quarter}>{quarter}</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="horizontalLine" />
			<div class="filtersAndClearFilterButton">
				<button
					class="clearFilterButton"
					on:click={() => {
						clearFilters(2);
						searchResultsFunction();
					}}>Clear filters</button
				>
				<div class="filter">
					<div class="title">Degree requirements</div>
					<div class="options">
						{#each Object.keys($searchFilters.degreeSpecific.checkboxes) as thisDegreeFilter}
							<div class="option">
								<input
									type="checkbox"
									id={thisDegreeFilter}
									name={thisDegreeFilter}
									on:click={searchResultsFunction}
									bind:checked={$searchFilters.degreeSpecific.checkboxes[thisDegreeFilter]}
								/>
								<label for={thisDegreeFilter}>{thisDegreeFilter}</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#each $resultCategories as category}
		{#if category.results && category.results.length != 0}
			<div class="resultsHeader {category.type}header">
				<div class="resultsHorizontalLine" />
				{category.title}
				<div class="resultsHorizontalLine" />
			</div>
			<div class="resultsHeader resultsHeaderShowing">
				Showing {category.numResultsShowing} of {category.numResultsFound}
			</div>
			<div
				class="results {category.type}"
				use:dndzone={{ items: category.results, flipDurationMs, dropTargetStyle: {} }}
				on:consider={(e) => handleDndConsider(e, category.type)}
				on:finalize={(e) => handleDndFinalize(e, category.type)}
			>
				{#each category.results as course (course.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<Course {course} />
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</section>

<style>
	section {
		box-sizing: border-box;
		font-weight: 400;
	}

	.inputContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.inputContainer > input {
		flex-grow: 1;
	}

	input {
		box-sizing: border-box;
		font-size: 1.2em;
		height: 1.8em;
		padding-left: 0.5em;
		padding-right: 0.1em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.numResultsInput {
		width: 4em;
		padding: 0;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		text-align: right;
	}

	.filtersHeaderButton {
		padding: 0 0.5em;
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

	.resultsHeaderShowing {
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.horizontalLine {
		width: 100%;
		height: 0.5em;
		background-color: var(--color-text-light);
		border-radius: 0.5em;
	}

	.results {
		max-height: 32em;
		overflow: auto;
	}

	.filtersMenuContainer {
		margin-top: 0.5em;
		margin-bottom: 0.3em;
		padding: 0.5em;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
		border: 0.25em solid var(--color-text-light);
	}

	.filters {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.filtersAndClearFilterButton {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 0.5em;
	}

	.clearFilterButton {
		width: 100%;
		box-sizing: border-box;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
	}

	.filter {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5em 0;
		flex: 1;
		width: 100%;
	}

	.title {
		font-weight: bold;
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
	}

	.title:not(:first-child) {
		margin-top: 1em;
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

	.fieldOptions {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.fieldOptions > input {
		width: 4em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		text-align: right;
	}

	.resultsHorizontalLine {
		flex: 1;
		margin: 0 0.5em;
		height: 0.5em;
		background-color: var(--color-text-light);
		border-radius: 0.5em;
	}

	.unitsAndWays {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.matchTypeGridFilter {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.leftAlign {
		align-self: flex-start;
	}
</style>
