<script>
	import { selectedCourse } from './../stores.js';
	import { courseTable, prefs } from '../stores.js';
	import { Link } from 'lucide-svelte';
	import WAYSIcon from './WAYSIcons.svelte';
	export let course = {};
	export let showDescription = false;
	let msChecked = false;
	let sncChecked = false;
	let afterLoad = false;

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

	function percentCompletedColor(averageEval) {
		if (averageEval == -1) {
			return '';
		}
		let hue = 0;
		if (averageEval > 50) {
			hue = ((averageEval - 50) / 50) * 120;
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

	function updateMs(e) {
		//Lock updates via $
		afterLoad = true;
		msChecked = e.target.checked;
		updateCourseById(course.id, 'ms', msChecked);
	}

	function updateSnc(e) {
		//Lock updates via $
		afterLoad = true;
		sncChecked = e.target.checked;
		updateCourseById(course.id, 'snc', sncChecked);
	}

	function mulberry32(a) {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	function courseColor(course) {
		let courseName = course.Class;
		let dept = courseName.split(' ')[0];
		let deptInt = 0;
		for (let i = 0; i < dept.length; i++) {
			deptInt += dept.charCodeAt(i) * Math.pow(10, i);
		}
		deptInt += 10;
		let rand = mulberry32(deptInt) * 360;
		if (!course?.ms) {
			return (
				'background: linear-gradient(to right, hsl(' + rand + ', 50%, 35%), rgba(0, 0, 0, 0.13)'
			);
		}
		return (
			'background: repeating-linear-gradient(45deg, hsl(' +
			rand +
			', 50%, 35%), hsl(' +
			rand +
			', 50%, 35%) 1em, hsl(' +
			rand +
			', 50%, 30%) 1em, hsl(' +
			rand +
			', 50%, 30%) 2em)'
		);
	}

	//Update checkboxes on load
	$: {
		if (!afterLoad) {
			msChecked = course?.ms;
			if (msChecked == undefined) {
				msChecked = false;
			}
			sncChecked = course?.snc;
			if (sncChecked == undefined) {
				sncChecked = false;
			}
		}
	}
</script>

<section
	style={courseColor(course)}
	role="tooltip"
	on:mouseenter={() => ($selectedCourse = course)}
>
	<div class="leftSide">
		{#if $prefs.courseTableData.showCheckboxes}
			<div class="checkboxesContainer">
				<div class="checkboxContainer">
					<input type="checkbox" checked={msChecked} on:change={updateMs} />
					MS
				</div>
				<div class="checkboxContainer">
					<input type="checkbox" checked={sncChecked} on:change={updateSnc} />
					SNC
				</div>
			</div>
		{/if}
		<div class="classCodeSpanContainer">
			<span class="classCode">{course.Class}</span>
			<span class="className">{course.Name}</span>
		</div>
	</div>

	<div class="rightSide">
		{#if $prefs.courseTableData.showWAYS}
			<div class="ways">
				<div class={'ways1 ' + course['WAYS 1']}>
					<WAYSIcon ways={course['WAYS 1']} />
				</div>
				<div class={'ways2 ' + course['WAYS 2']}>
					<WAYSIcon ways={course['WAYS 2']} />
				</div>
			</div>
		{/if}
		{#if $prefs.courseTableData.showLinks}
			<div class="classLinks">
				<div class="classLink">
					<a href={course.Link} target="_blank">
						<Link size={linkSize} />
					</a>
				</div>
				<div class="classLink">
					<a href={course.Link} target="_blank">
						<Link class="icon" size={linkSize} />
					</a>
				</div>
			</div>
		{/if}
		{#if $prefs.courseTableData.showPercent}
			<div class="percentCompletedAndAverageEval">
				<div class="percentCompleted" style={percentCompletedColor(course['Percent Completed'])}>
					{course['Percent Completed'] == -1 ? '' : course['Percent Completed']}
				</div>
				<div class="averageEval" style={averageEvalColor(course['Average Eval'])}>
					{course['Average Eval'] == -1 ? '' : course['Average Eval']}
				</div>
			</div>
		{/if}
		<div class="classHours">{course['Mean Hours'] == -1 ? 0 : course['Mean Hours']}</div>
		<div class="classUnits">{course['Units Ceiling']}</div>
	</div>
</section>
{#if showDescription}
	<div class="classDescription">{course.Description}</div>
{/if}

<style>
	section {
		box-sizing: border-box;
		text-align: left;
		border: 0px;
		color: var(--color-text-light);
		border-radius: 1em;
		height: 3.5em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 0.25em;
	}

	.topRow {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.leftSide {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		margin-left: 0.2em;
	}
	.leftSide > * {
		height: 100%;
		margin-right: 0.2em;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 1.2em;
	}
	.checkboxContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
	}

	.classCodeContainer {
		display: flex;
		flex-direction: column;
	}

	.classCodeSpanContainer {
		display: inline;
		overflow: auto;
		margin-left: 0.2em;
	}

	.classCode {
		font-size: 1.2em;
		font-weight: bold;
		font-style: italic;
	}
	.className {
		font-size: 0.8em;
	}

	.rightSide {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: right;
		margin-right: 0.5em;
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
		max-height: 44%;
		width: 100%;
		border-radius: 0.3em;
		margin: 0.1em 0;
		color: var(--color-text-dark);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
		justify-content: center;
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

	.classDescription {
		font-size: 1em;
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
