<script>
	import WAYSIcons from './WAYSIcons.svelte';
	import { Link, PinOff } from 'lucide-svelte';
	import {
		allCourses,
		reviewData,
		selectedCourse,
		selectedCoursePinned,
		courseTable
	} from '../stores';
	import { courseColor } from '../utils/utils.js';
	import {} from 'lucide-svelte';
	import { tick } from 'svelte';

	let course = {};
	$: course = $selectedCourse;
	let unitsTaking = 0;
	let linkSize = '20';

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

	let thisReviewData = undefined;
	$: {
		if (course.code && $reviewData != undefined) {
			thisReviewData = $reviewData[course.code];
		}
	}

	let reviewDataParsed = {
		totals: {
			numPositive: 0,
			numNegative: 0
		},
		data: {}
	};
	$: {
		if (thisReviewData) {
			//Go through each review. Determine if it is positive or negative, and determine
			//if its teacher is known, multiple, or unknown. If it is known, add it to the
			reviewDataParsed = {
				totals: {
					numPositive: 0,
					numNegative: 0
				},
				data: {}
			};

			thisReviewData.forEach((r) => {
				let sentiment = parseFloat(r.substring(1, r.indexOf(']')));
				let rNoSentiment = r.substring(r.indexOf(']') + 1);
				//Term is substring up to ], not including first [
				let term = rNoSentiment.substring(2, rNoSentiment.indexOf(']'));
				//Log course data
				let pastOfferings = course?.past_offerings;
				let instructors = [];
				let thisInstructor = '';

				if (pastOfferings != undefined) {
					pastOfferings.forEach((offering) => {
						if (offering.term === term) {
							instructors.push(offering.instructor_name);
						}
					});
				}

				if (instructors.length == 0) {
					thisInstructor = 'Unknown';
				} else if (instructors.length == 1) {
					thisInstructor = instructors[0];
				} else if (instructors.length > 1) {
					thisInstructor = 'One of several';
				}

				if (reviewDataParsed.data[thisInstructor] == undefined) {
					reviewDataParsed.data[thisInstructor] = {
						positive: [],
						negative: []
					};
				}
				const sentimentThreshold = -0.5;
				rNoSentiment = '[' + thisInstructor + '] ' + rNoSentiment;
				if (sentiment > sentimentThreshold) {
					reviewDataParsed.totals.numPositive++;
					reviewDataParsed.data[thisInstructor].positive.push(rNoSentiment);
				} else if (sentiment <= sentimentThreshold) {
					reviewDataParsed.totals.numNegative++;
					reviewDataParsed.data[thisInstructor].negative.push(rNoSentiment);
				}
			});
			//In reviewDataParsed.data, move "One of several" to the end, then move "Unknown" to the end
			//If they exist
			if (reviewDataParsed.data['One of several'] != undefined) {
				let val = reviewDataParsed.data['One of several'];
				delete reviewDataParsed.data['One of several'];
				reviewDataParsed.data['One of several'] = val;
			}
			if (reviewDataParsed.data['Unknown'] != undefined) {
				let val = reviewDataParsed.data['Unknown'];
				delete reviewDataParsed.data['Unknown'];
				reviewDataParsed.data['Unknown'] = val;
			}
		}
	}

	//Set default value on load
	$: {
		if (!course.code) {
			let firstCourse = $allCourses.find((c) => c.code === 'CS 106A');
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

<div class="content">
	<div class="header">
		<div class="courseCodeAndNameContainer" style={courseColor(course)}>
			<span class="courseCode">{course.code}</span>
			<span class="courseName"
				>{course?.long_title?.substring(course.long_title.indexOf(':') + 2)}</span
			>
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
					{course.ways[0]}
					<WAYSIcons ways={course.ways[0]} />
				</div>
			{/if}
			{#if course.ways && course.ways.length >= 2}
				<div class={'WAYS ' + course.ways[1]}>
					{course.ways[1]}
					<WAYSIcons ways={course.ways[1]} />
				</div>
			{/if}
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
		<div class="ratingCompletionData">
			{#if course.average_rating != -1}
				<div class="averageEval">Rated {course.average_rating}/5</div>
			{/if}
			{#if course.percent_outcomes_completed != -1}
				<div class="percentCompleted">
					Completion rate: {course.percent_outcomes_completed}%
				</div>
			{/if}
			{#if course?.seasons_offered?.length > 0}
				<div class="seasonsOffered">
					{#each course.seasons_offered as season, s}
						<div class={'season ' + season}>
							{season}
						</div>
					{/each}
				</div>
			{:else}
				<div class="seasonsOffered">
					<div class="season notOffered">Not offered</div>
				</div>
			{/if}
		</div>
	</div>
	<p class="courseDesc">{course.description}</p>
	<div class="courseReviews">
		<div class="disclaimer">
			Sentiment classification is AI-generated - categorizations may be inaccurate
		</div>
		<div class="courseReviewsBlocks">
			<div class="totalsHeader">Overall review count:</div>
			<div class="totalsHeaderNonBold">
				{reviewDataParsed.totals?.numPositive} likely positive,
				{reviewDataParsed.totals?.numNegative} potentially negative
			</div>
			<div class="horizontalLine" />
			{#each Object.keys(reviewDataParsed?.data) as instructor}
				<div class="teachersBlock">
					<div class="teacherName">{instructor}</div>
					<div class="reviewsBlock">
						<div class="positiveReviews">
							<div class="positiveReviewCount">
								{reviewDataParsed.data[instructor].positive.length} likely positive
							</div>
							{#each reviewDataParsed.data[instructor].positive as r}
								<div class="review">{r}</div>
							{/each}
						</div>
						<div class="negativeReviews">
							<div class="negativeReviewCount">
								{reviewDataParsed.data[instructor].negative.length} potentially negative
							</div>
							{#each reviewDataParsed.data[instructor].negative as r}
								<div class="review">{r}</div>
							{/each}
						</div>
					</div>
				</div>
				{#if instructor != Object.keys(reviewDataParsed.data)[Object.keys(reviewDataParsed.data).length - 1]}
					<div class="horizontalLine" />
				{/if}
			{/each}
		</div>
	</div>
	{#if $selectedCoursePinned}
		<button
			class="unpinButton"
			on:click={() => {
				$selectedCoursePinned = false;
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			<PinOff />
		</button>
	{/if}
</div>

<style>
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
		width: 3em;
		height: 1em;
		border-radius: 0.3em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
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

	.courseReviewsBlocks {
		width: 100%;
		height: 100%;
	}
	.totalsBlock,
	.reviewsBlock {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.reviewsBlock > * {
		flex: 1;
	}
	.totalsContainer {
		border: 1px solid var(--color-text-light);
	}
	.totalsHeader,
	.totalsHeaderNonBold,
	.teacherName {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.5em;
		font-style: italic;
	}
	.totalsHeader {
		font-weight: bold;
		font-style: normal;
	}

	.horizontalLine {
		width: 100%;
		height: 0.5em;
		background-color: var(--color-text-light);
		border-radius: 0.5em;
		margin: 1em 0;
	}

	.positiveReviewCount,
	.negativeReviewCount {
		font-size: 1.5em;
		/* font-weight: bold; */
		margin-bottom: 0.5em;
		text-align: center;
	}

	.review {
		border: 1px solid var(--color-text-light);
		margin: 0.5em 0.25em;
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

	.seasonsOffered {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.season {
		border-radius: 0.5em;
		padding: 0.25em;
		margin: 0.25em;
	}
	.Autumn {
		background-color: var(--autumn);
		color: var(--autumn-text);
	}
	.Winter {
		background-color: var(--winter);
		color: var(--winter-text);
	}
	.Spring {
		background-color: var(--spring);
		color: var(--spring-text);
	}
	.Summer {
		background-color: var(--summer);
		color: var(--summer-text);
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
