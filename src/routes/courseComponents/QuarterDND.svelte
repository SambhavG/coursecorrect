<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, allCourses, courseTable, searchResults } from '../stores.js';
	import { CornerDownLeft } from 'lucide-svelte';

	import Course from '../courseComponents/Course.svelte';

	export let quarter;
	export let y;
	export let q;
	let search = '';
	let searchCourse = null;
	let totalHours = 0;
	let totalUnits = 0;

	const flipDurationMs = 200;

	function handleDndConsider(e, y, q) {
		$courseTable[y].quarters[q].courses = e.detail.items;
	}
	function handleDndFinalize(e, yearId, quarterId) {
		handleDndConsider(e, yearId, quarterId);
	}

	function calculateTotalHours(courses) {
		let total = 0;
		for (let i = 0; i < courses.length; i++) {
			let thisHours = courses[i]['Mean Hours'];
			if (thisHours != '-1') {
				total += parseInt(thisHours);
			}
		}
		return total;
	}
	function calculateTotalUnits(courses) {
		let total = 0;
		for (let i = 0; i < courses.length; i++) {
			let thisUnits = courses[i]['Units Ceiling'];
			if (thisUnits != '-1') {
				total += parseInt(thisUnits);
			}
		}
		return total;
	}

	function updateSearchCourse(e) {
		//Find course in allCourses
		let course = $allCourses.find(
			(course) =>
				course.Class.toLowerCase().replace(/\s+/g, '') === search.toLowerCase().replace(/\s+/g, '')
		);
		if (course === undefined) {
			searchCourse = null;
		}
		searchCourse = course;
	}
	function addCourse() {
		searchCourse = { ...searchCourse };
		searchCourse.id = searchCourse.id.split('|')[0] + '|' + Math.random().toString(36).substring(7);
		$courseTable[y].quarters[q].courses.push(searchCourse);
		$courseTable = $courseTable;
		searchCourse = null;
		search = '';
	}
	function handleKeyDown(e) {
		if (e.key === 'Enter' && searchCourse != null) {
			addCourse();
		}
	}
	function handleClick() {
		if (searchCourse != null) {
			addCourse();
		}
	}

	$: {
		totalHours = calculateTotalHours(quarter.courses);
		totalUnits = calculateTotalUnits(quarter.courses);
	}
</script>

<section>
	<div class="title">
		{$years[y] + ' ' + $quarters[q]}
	</div>
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
	<div class="bottomHalf">
		<div class="addCourse">
			<input
				type="text"
				bind:value={search}
				on:input={updateSearchCourse}
				on:keydown={handleKeyDown}
			/>
			<button on:click={handleClick} style={'all: unset'}>
				<CornerDownLeft
					size="1.5em"
					color={searchCourse ? 'green' : 'gray'}
					on:click={handleClick}
				/>
			</button>
		</div>
		<div class="totals">
			<div class="totalHours">
				{totalHours}
			</div>
			<div class="totalUnits">
				{totalUnits}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: space-between;
		transition: height 0.3s ease, opacity 0.3s ease;
	}
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.4em;
	}
	.courseDndList {
		height: 100%;
		min-height: 8em;
		display: flex;
		flex-direction: column;
	}
	.bottomHalf {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 1.8em;
		margin-top: 1em;
	}
	.addCourse {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	}
	input {
		box-sizing: border-box;
		width: 11em;
		height: 1.8em;
		padding-left: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}

	.totals {
		box-sizing: border-box;
		height: 1.8em;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 0.5em;
	}
	.totals > * {
		width: 1.95em;
		margin-left: 0.2em;
		text-align: right;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
