<script>
	import WAYSIcons from './WAYSIcons.svelte';
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { allCourses, prefs, selectedCourse, selectedCoursePinned } from '../stores';
	import { courseColor } from '../utils/utils.js';
	let course = {};
	$: course = $selectedCourse;

	//Set default value on load
	$: {
		if (!course.Class) {
			let firstCourse = $allCourses.find((c) => c.Class === 'CS 106A');
			firstCourse = $allCourses[0];
			if (firstCourse) {
				course = firstCourse;
			}
		}
	}

	//Create an array of hours for the course
	let hoursArray = [];
	$: {
		hoursArray = Array.from(
			{ length: course.unitsCeiling - course.unitsFloor + 1 },
			(_, i) => course.unitsFloor + i
		);
	}

	/*
	Data we want to show:
		* Course code
		* Course name
		- Course units & unit selector
		- WAYS reqs
		- Average hours
		- Grading options
		- Explorecourses and carta link
		- Course description
		- Course terms offered
		- Course grading
		- Average reviews
		- Average percent complete
		- Most common year taken
		- Button to open expanded view modal
			- All of the above
			- Review viewer with ai summary
			- Hours, sequencing, enrollment outcomes graphs
			- All past terms with professors and evals
	*/
</script>

<section>
	<button
		on:click={() => {
			$prefs.courseDataPanelCollapsed = !$prefs.courseDataPanelCollapsed;
		}}
	>
		{#if $prefs.courseDataPanelCollapsed}
			<ChevronsUpDown />
		{:else}
			<ChevronsDownUp />
		{/if}
	</button>
	{#if !$prefs.courseDataPanelCollapsed}
		<div class="content">
			<div class="header">
				<div class="courseCodeAndNameContainer" style={courseColor(course)}>
					<span class="courseCode">{course.Class}</span>
					<span class="courseName">{course.Name}</span>
				</div>
				<div class="hoursUnitsWaysData">
					<div class="courseHours"><b>{course.hours == -1 ? 0 : course.hours}</b> h/week</div>

					{#if course.unitsFloor != course.unitsCeiling}
						<div class="courseUnits">
							<select value={course.unitsTaking}>
								{#each hoursArray as i (i)}
									<option value={i}>{i}</option>
								{/each}
							</select> units
						</div>
					{:else}
						<div class="courseUnits"><b>{course.unitsCeiling}</b> units</div>
					{/if}
					{#if course.WAYS && course.WAYS.length >= 1}
						<div class={'WAYS ' + course.WAYS[0]}>
							<WAYSIcons ways={course.WAYS[0]} />
						</div>
					{/if}
					{#if course.WAYS && course.WAYS.length >= 2}
						<div class={'WAYS ' + course.WAYS[1]}>
							<WAYSIcons ways={course.WAYS[1]} />
						</div>
					{/if}
				</div>
				<div class="ratingCompletionData">
					{#if course.averageEval != -1}
						<div class="averageEval">Rated {course.averageEval}/5</div>
					{/if}
					{#if course.percentCompleted != -1}
						<div class="percentCompleted">Completion rate: {course.percentCompleted}%</div>
					{/if}
				</div>
			</div>
			<p class="courseDesc">{course.Description}</p>
			{#if $selectedCoursePinned}
				<button
					class="unpinButton"
					on:click={() => {
						$selectedCoursePinned = false;
					}}
				>
					Course pinned; click to unpin
				</button>
			{/if}
		</div>
	{:else}
		<div class="hiddenNotif">Course data hidden</div>
	{/if}
</section>

<style>
	section {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border: 0.25em solid var(--color-text-light);
	}

	button {
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-style: none;
		border-right: 0.25em solid;
		padding: 0;
		width: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content {
		position: relative;
		height: 20em;
		padding: 1em;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.hiddenNotif {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		font-size: 1.5em;
	}

	.header {
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.courseCodeAndNameContainer {
		width: 100%;
		display: inline;
		overflow: auto;
		margin-bottom: 0.5em;
		flex: 1;
		text-align: left;
		border-radius: 1em;
		padding-left: 0.5em;
	}

	.courseCode {
		font-size: 3em;
		font-weight: bold;
		margin-right: 0.3em;
	}

	.courseName {
		font-size: 2em;
		font-weight: bold;
		margin: 0.5em 0;
	}

	.hoursUnitsWaysData {
		width: 100%;
		font-size: 2em;
		flex: 0 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.hoursUnitsWaysData > * {
		margin-right: 0.5em;
	}
	.ratingCompletionData {
		width: 100%;
		font-size: 1.5em;
		flex: 0 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.ratingCompletionData > * {
		margin-right: 0.5em;
	}

	select {
		/* style same as everything else */
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-style: none;
		font-size: 1em;
		font: inherit;
		font-weight: bold;
	}

	.courseDesc {
		text-align: left;
		font-size: 1.5em;
		max-height: 10em;
		width: 100%;
		overflow-y: scroll;
	}

	.WAYS {
		width: 1em;
		height: 1em;
		border-radius: 0.3em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.unpinButton {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-top: 0.25em solid var(--color-text-light);
		border-right: 0.25em solid var(--color-text-light);
		font: inherit;
		font-size: 1.2em;
		font-weight: bold;
		width: 14em;
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
