<script>
	import WAYSIcons from './WAYSIcons.svelte';
	import { ChevronsDownUp, ChevronsUpDown, PinOff } from 'lucide-svelte';
	import { allCourses, prefs, selectedCourse, selectedCoursePinned, courseTable } from '../stores';
	import { courseColor } from '../utils/utils.js';
	import {} from 'lucide-svelte';
	import reviews0 from '../data/reviews/reviews0.json';
	import reviews1 from '../data/reviews/reviews1000.json';
	import reviews2 from '../data/reviews/reviews2000.json';
	import reviews3 from '../data/reviews/reviews3000.json';
	import reviews4 from '../data/reviews/reviews4000.json';
	import reviews5 from '../data/reviews/reviews5000.json';
	import reviews6 from '../data/reviews/reviews6000.json';
	import reviews7 from '../data/reviews/reviews7000.json';
	import reviews8 from '../data/reviews/reviews8000.json';
	import reviews9 from '../data/reviews/reviews9000.json';
	import reviews10 from '../data/reviews/reviews10000.json';
	import reviews11 from '../data/reviews/reviews11000.json';
	import reviews12 from '../data/reviews/reviews12000.json';
	import reviews13 from '../data/reviews/reviews13000.json';

	let course = {};
	$: course = $selectedCourse;
	let unitsTaking = 0;
	//Update unitsTaking on load
	$: {
		//We don't want to trigger an update
		//if they are already in sync
		if (unitsTaking != course.units_taking) {
			unitsTaking = course.units_taking;
		}
	}

	function updateUnitsTaking(e) {
		updateCourseById(course.id, 'units_taking', +e.target.value);
		course = course;
	}

	let reviewData = undefined;
	$: {
		if (course.code) {
			reviewData = [
				reviews0[course.code],
				reviews1[course.code],
				reviews2[course.code],
				reviews3[course.code],
				reviews4[course.code],
				reviews5[course.code],
				reviews6[course.code],
				reviews7[course.code],
				reviews8[course.code],
				reviews9[course.code],
				reviews10[course.code],
				reviews11[course.code],
				reviews12[course.code],
				reviews13[course.code]
			].filter((r) => r)[0];
		}
	}

	let positiveReviews = [];
	let neutralReviews = [];
	let negativeReviews = [];
	$: {
		if (reviewData) {
			positiveReviews = [];
			neutralReviews = [];
			negativeReviews = [];
			reviewData.forEach((r) => {
				let sentiment = parseFloat(r.substring(1, r.indexOf(']')));
				let rNoSentiment = r.substring(r.indexOf(']') + 1);
				if (sentiment > 0.05) {
					positiveReviews.push(rNoSentiment);
				} else if (sentiment < -0.05) {
					negativeReviews.push(rNoSentiment);
				} else {
					neutralReviews.push(rNoSentiment);
				}
			});
		}
	}

	//Set default value on load
	$: {
		//console.log(reviewData['CS 106B'][0]);
		if (!course.code) {
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
			{ length: course.max_units - course.min_units + 1 },
			(_, i) => course.min_units + i
		);
	}

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
					<span class="courseCode">{course.code}</span>
					<span class="courseName">{course.short_title}</span>
				</div>
				<div class="hoursUnitsWaysData">
					<div class="courseHours">
						<b>{course.int_hours == -1 ? 0 : course.int_hours}</b> h/week
					</div>

					{#if course.min_units != course.max_units}
						<div class="courseUnits">
							<select value={unitsTaking} on:change={updateUnitsTaking}>
								{#each hoursArray as i (i)}
									<option value={i}>{i}</option>
								{/each}
							</select>
							unit{unitsTaking == 1 ? '' : 's'}
						</div>
					{:else}
						<div class="courseUnits">
							<b>{course.max_units}</b> unit{unitsTaking == 1 ? '' : 's'}
						</div>
					{/if}
					{#if course.ways && course.ways.length >= 1}
						<div class={'WAYS ' + course.ways[0]}>
							<WAYSIcons ways={course.ways[0]} />
						</div>
					{/if}
					{#if course.ways && course.ways.length >= 2}
						<div class={'WAYS ' + course.ways[1]}>
							<WAYSIcons ways={course.ways[1]} />
						</div>
					{/if}
				</div>
				<div class="ratingCompletionData">
					{#if course.average_rating != -1}
						<div class="averageEval">Rated {course.average_rating}/5</div>
					{/if}
					{#if course.percent_outcomes_completed != -1}
						<div class="percentCompleted">
							Completion rate: {course.percent_outcomes_completed}%
						</div>
					{/if}
				</div>
			</div>
			<p class="courseDesc">{course.description}</p>
			<div class="courseReviews">
				<div class="disclaimer">
					Sentiment classification is AI-generated - categorizations may be inaccurate
				</div>
				<div class="courseReviewsColumns">
					<div class="positiveReviews">
						<div class="positiveReviewCount">
							{positiveReviews.length} positive
						</div>
						{#each positiveReviews as r}
							<div class="review">{r}</div>
						{/each}
					</div>
					<div class="neutralReviews">
						<div class="neutralReviewCount">
							{neutralReviews.length} neutral
						</div>
						{#each neutralReviews as r}
							<div class="review">{r}</div>
						{/each}
					</div>
					<div class="negativeReviews">
						<div class="negativeReviewCount">
							{negativeReviews.length} negative
						</div>
						{#each negativeReviews as r}
							<div class="review">{r}</div>
						{/each}
					</div>
				</div>
			</div>
			{#if $selectedCoursePinned}
				<button
					class="unpinButton"
					on:click={() => {
						$selectedCoursePinned = false;
					}}
				>
					<PinOff />
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
		box-sizing: content-box;
		height: 30em;
		padding: 1em;

		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		overflow-y: auto;
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
		overflow-y: auto;
		flex-grow: 0;
		flex-shrink: 0;
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

	.courseReviews {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		flex-basis: 0;
		flex-grow: 1;
	}

	.disclaimer {
		margin-bottom: 0.5em;
	}

	.courseReviewsColumns {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.courseReviewsColumns > * {
		margin: 0 0.5em;
		flex: 1;
		height: 100%;
		overflow-y: scroll;
	}

	.positiveReviewCount,
	.neutralReviewCount,
	.negativeReviewCount {
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 0.5em;
		text-align: center;
	}

	.review {
		border: 1px solid var(--color-text-light);
		margin: 0.5em 0;
		padding: 0.5em;
	}

	.unpinButton {
		position: sticky;
		bottom: 0;
		left: 0;
		width: 4em;
		height: 4em;
		padding: 1em;
		box-sizing: border-box;
		background-color: var(--color-text-dark);
		border: 0.25em solid var(--color-text-light);
		border-radius: 50%;
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
