<script>
	import { selectedCourse } from './../stores.js';
	import { courseTable, prefs } from '../stores.js';
	import { Link, Text } from 'lucide-svelte';
	import WAYSIcon from './WAYSIcons.svelte';
	export let course = {};
	export let showDescription = false;

	function aii(str) {
		if (str == 'A-II') {
			return 'AII';
		}
		return str;
	}

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

	let iconSize = '24';
	let linkSize = '14';

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
		return 'background: linear-gradient(to right, hsl(' + rand + ', 50%, 35%), rgba(0, 0, 0, 0.13)';
	}
</script>

<section style={courseColor(course)}>
	<div class="leftSide">
		<div class="classDesc" role="tooltip" on:mouseenter={() => ($selectedCourse = course)}>
			<Text class="icon" size={iconSize} />
		</div>
		<div class="classCodeContainer">
			<div class="classCodeSpanContainer">
				<span class="classCode">{course.Class}</span>
				<span class="className">{course.Name}</span>
			</div>
		</div>
	</div>

	<div class="rightSide">
		{#if $prefs.courseTableData.showWAYS}
			<div class="ways">
				<div class={'ways1 ' + aii(course['WAYS 1'])}>
					<WAYSIcon ways={aii(course['WAYS 1'])} />
				</div>
				<div class={'ways2 ' + aii(course['WAYS 2'])}>
					<WAYSIcon ways={aii(course['WAYS 2'])} />
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

		/* border: 1px solid var(--color-text-light); */
		border: 0px;
		color: var(--color-text-light);
		/* background: linear-gradient(to right, rgba(0, 0, 255, 0.1), rgba(0, 0, 0, 0.13)); */

		border-radius: 1em;
		max-width: var(--course-width);
		min-width: calc(var(--course-width) - 5em);
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

	.classCodeContainer {
		/* Should be wide enough to fit 14 characters */
		min-width: 10em;
		display: flex;
		flex-direction: column;
	}

	.classCodeSpanContainer {
		display: inline;
		overflow: auto;
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
