<script>
	import { selectedCourse, selectedCoursePinned } from './../stores.js';
	import { courseTable, prefs } from '../stores.js';
	import { Link } from 'lucide-svelte';
	import { courseColor } from '../utils/utils.js';
	import WAYSIcon from './WAYSIcons.svelte';
	import { tick } from 'svelte';
	export let course = {};
	let msChecked = false;
	let csncChecked = false;

	function averageEvalColor(averageEval) {
		//Gradient with 0-3 red, 4 yellow, 5 green
		if (averageEval == -1) {
			return '';
		}
		let hue = 0;
		if (averageEval > 3) {
			hue = ((averageEval - 3) / 2) * 120;
		}
		return 'background-color: hsl(' + hue + ', 100%, 50%)';
	}

	function percentCompletedColor(percentCompleted) {
		if (percentCompleted == -1) {
			return '';
		}
		let hue = 0;
		if (percentCompleted > 50) {
			hue = ((percentCompleted - 50) / 50) * 120;
		}
		return 'background-color: hsl(' + hue + ', 100%, 50%)';
	}

	let linkSize = '14';

	function updateCourseById(id, property, newValue) {
		//Loop through all the courses in courseTable
		for (let i = 0; i < $courseTable.length; i++) {
			//Loop through all the quarters in the year
			for (let j = 0; j < $courseTable[i].quarters.length; j++) {
				//Loop through all the courses in the quarter
				for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
					//If the course id matches the id we're looking for, update the property
					if ($courseTable[i].quarters[j].courses[k].id == id) {
						$courseTable[i].quarters[j].courses[k][property] = newValue;
						return;
					}
				}
			}
		}
	}

	function bump() {
		updateCourseById(course.id, 'bump', course.bump + 1);
	}

	function resetBump() {
		updateCourseById(course.id, 'bump', 0);
	}

	function updateMs(e) {
		//Lock updates via $
		msChecked = e.target.checked;
		updateCourseById(course.id, 'ms', msChecked);
	}

	function updateSnc(e) {
		//Lock updates via $
		csncChecked = e.target.checked;
		updateCourseById(course.id, 'csnc', csncChecked);
	}

	//Update checkboxes on load
	$: {
		//We don't want to trigger an update
		//if there is no update
		if (msChecked != course.ms) {
			msChecked = course.ms;
		}
		if (csncChecked != course.csnc) {
			csncChecked = course.csnc;
		}
	}
</script>

<button
	class="section"
	on:mouseenter={() => {
		if (!$selectedCoursePinned) {
			$selectedCourse = course;
		}
	}}
	on:click={() => {
		$selectedCourse = course;
		$selectedCoursePinned = true;
		const scrollPosition = document.scrollingElement.scrollTop;
		tick().then(() => {
			document.scrollingElement.scrollTop = scrollPosition;
		});
	}}
>
	<div class="coverUpButton" style={courseColor(course)}>
		<div class="leftSide">
			{#if $prefs.courseTableData['Bump button']}
				<div class="checkboxesContainer">
					<div class="checkboxContainer">
						<button on:click={bump}>Bump</button>
					</div>
					<div class="checkboxContainer">
						<button on:click={resetBump}>Reset</button>
					</div>
				</div>
			{/if}
			{#if $prefs.courseTableData['Checkboxes']}
				<div class="checkboxesContainer">
					<div class="checkboxContainer">
						<input type="checkbox" checked={msChecked} on:change={updateMs} />
						MS
					</div>
					<div class="checkboxContainer">
						<input type="checkbox" checked={csncChecked} on:change={updateSnc} />
						C/SNC
					</div>
				</div>
			{/if}
			<div class="classCodeSpanContainer">
				<span class="classCode">{course.code}</span>
				<span class="className">{course.short_title}</span>
			</div>
		</div>
		<div class="rightSide">
			{#if $prefs.courseTableData['WAYS']}
				<div class="ways">
					{#if course.ways.length >= 1}
						<div class={'ways1 ' + course.ways[0]}>
							<WAYSIcon ways={course.ways[0]} />
						</div>
					{/if}
					{#if course.ways.length >= 2}
						<div class={'ways2 ' + course.ways[1]}>
							<WAYSIcon ways={course.ways[1]} />
						</div>
					{:else}
						<div class="ways2" />
					{/if}
				</div>
			{/if}
			{#if $prefs.courseTableData['Links']}
				<div class="classLinks">
					<div class="classLink">
						<a
							href={'https://explorecourses.stanford.edu/search?q="' + course.code + '"'}
							target="_blank"
						>
							<Link size={linkSize} />
						</a>
					</div>
					<div class="classLink">
						<a href={course.carta_link} target="_blank">
							<Link class="icon" size={linkSize} />
						</a>
					</div>
				</div>
			{/if}
			{#if $prefs.courseTableData['Percent completed & eval']}
				<div class="percentCompletedAndAverageEval">
					<div
						class="percentCompleted"
						style={percentCompletedColor(course.percent_outcomes_completed)}
					>
						{course.percent_outcomes_completed == -1 ? '' : course.percent_outcomes_completed}
					</div>
					<div class="averageEval" style={averageEvalColor(course.average_rating)}>
						{course.average_rating == -1 ? '' : course.average_rating}
					</div>
				</div>
			{/if}
			<div class="classHours">{course.int_hours == -1 ? 0 : course.int_hours}</div>
			<div class="classUnits">{course.units_taking}</div>
		</div>
	</div>
</button>

<style>
	.section {
		all: unset;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		border: 0px;
		color: var(--color-text-light);
		border-radius: 1em;
		height: 4em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 0.25em;
		/* font-size: 0.7em; */
	}

	.coverUpButton {
		all: inherit;
		width: 10000%;

		height: 100%;
	}

	.leftSide {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		margin-left: 0.2em;
		margin: 0.3em 0;
	}
	.leftSide > * {
		height: 100%;
		margin-right: 0.2em;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.checkboxContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		margin-left: 0.3em;
	}

	button {
		all: inherit;
		padding: 0 0.5em;
		width: 100%;
		height: 80%;
		border: 1px solid var(--color-text-light);
		border-radius: 1em;
		margin: 0.1em 0;
		color: var(--color-text-light);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.classCodeSpanContainer {
		display: inline;
		overflow: auto;
		margin-left: 0.5em;
	}

	.classCode {
		font-size: 1.5em;
		font-weight: bold;
	}
	.className {
		font-size: 1em;
		text-shadow: var(--color-text-dark) 0 0 0.4em;
	}

	.rightSide {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: right;
		margin-right: 0.5em;
		font-weight: bold;
	}

	.rightSide > * {
		width: 1.9em;
		text-align: right;
		margin-left: 0.2em;
		display: flex;
		flex-direction: column;
	}

	.ways {
		height: 100%;
		margin: 0 0.1em;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.ways > * {
		height: 50%;
		width: 100%;
		border-radius: 0.3em;
		margin: 0.1em 0;
		color: var(--color-text-dark);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.ways1 {
		align-self: flex-start;
	}

	.ways2 {
		align-self: flex-end;
	}

	.percentCompletedAndAverageEval {
		height: 100%;
		margin: 0 0.1em;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.percentCompletedAndAverageEval > * {
		height: 50%;
		width: 100%;
		border-radius: 0.3em;
		margin: 0.1em 0;
		color: var(--color-text-dark);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: bold;
	}

	.percentCompleted {
		align-self: flex-start;
	}

	.averageEval {
		align-self: flex-end;
	}

	.classLinks {
		height: 100%;
		margin: 0 0.1em;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.classLink {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	a {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.AII {
		background-color: var(--aii);
		color: var(--aii-text);
	}
	.SMA {
		background-color: var(--sma);
		color: var(--sma-text);
	}
	.SI {
		background-color: var(--si);
		color: var(--si-text);
	}
	.AQR {
		background-color: var(--aqr);
		color: var(--aqr-text);
	}
	.CE {
		background-color: var(--ce);
		color: var(--ce-text);
	}
	.EDP {
		background-color: var(--edp);
		color: var(--edp-text);
	}
	.ER {
		background-color: var(--er);
		color: var(--er-text);
	}
	.FR {
		background-color: var(--fr);
		color: var(--fr-text);
	}
</style>
