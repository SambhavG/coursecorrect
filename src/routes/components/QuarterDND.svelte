<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, allCourses, courseTable, isDragging } from '../stores.js';
	import { CornerDownLeft } from 'lucide-svelte';
	import { tick } from 'svelte';

	import Course from './Course.svelte';

	export let quarter;
	export let y;
	export let q;
	let search = '';
	let searchCourse = null;
	let totalHours = 0;
	let totalUnits = 0;

	const flipDurationMs = 200;

	let scrollPosition = 0;

	function handleDndConsider(e, y, q) {
		scrollPosition = document.scrollingElement.scrollTop;
		$courseTable[y].quarters[q].courses = e.detail.items;
		$isDragging = true;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
	}
	function handleDndFinalize(e, y, q) {
		scrollPosition = document.scrollingElement.scrollTop;
		$courseTable[y].quarters[q].courses = e.detail.items;
		$isDragging = false;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
	}

	function calculateTotalHours(courses) {
		let total = 0;
		for (let i = 0; i < courses.length; i++) {
			let thisHours = courses[i].int_hours;
			if (thisHours != -1) {
				total += thisHours;
			}
		}
		return total;
	}
	function calculateTotalUnits(courses) {
		let total = 0;
		for (let i = 0; i < courses.length; i++) {
			let thisUnits = courses[i].units_taking;
			total += thisUnits;
		}
		return total;
	}

	function updateSearchCourse(e) {
		//Find course in allCourses
		let course = $allCourses.find(
			(course) =>
				course.code.toLowerCase().replace(/\s+/g, '') === search.toLowerCase().replace(/\s+/g, '')
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
		const scrollPosition = document.scrollingElement.scrollTop;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
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
		use:dndzone={{
			items: quarter.courses,
			flipDurationMs,
			dropTargetStyle: {}
		}}
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
				placeholder="course"
			/>
			<button on:click={handleClick}>
				<CornerDownLeft size="2em" color={searchCourse ? 'green' : 'gray'} on:click={handleClick} />
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
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: height 0.3s ease, opacity 0.3s ease;
	}
	.title {
		max-width: 100%;
		height: 2em;
		font-size: 2em;
		font-weight: bold;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.courseDndList {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.bottomHalf {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 1em;
	}
	.addCourse {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		max-width: 14em;
	}
	input {
		box-sizing: border-box;
		width: 100%;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		font-size: 1.5em;
		border-radius: 1em;
		background-color: var(--color-text-light);
		color: var(--color-text-dark);
		font-family: var(--font-mono);
	}
	button {
		all: unset;
	}
	.totals {
		box-sizing: border-box;
		height: 1.8em;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 0.5em;
		font-weight: bold;
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
