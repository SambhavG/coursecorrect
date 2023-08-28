<script>
	import { prefs, courseWidth } from '../stores.js';
	import { Link, Text } from 'lucide-svelte';
	import WAYSIcon from './WAYSIcons.svelte';
	export let course = {};

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

	let iconSize = '16';

	//Sizing:
	//Left:
	// 0.5 margin
	// 1   desc icon
	// 0.2 margin-right
	// 9   class code
	// 0.2 margin-right

	//Right:
	// 0.2 margin-left
	// 1.5 ways1
	// 0.2 margin-left
	// 1.5 ways2
	// 0.2 margin-left
	// 1.5 link
	// 0.2 margin-left
	// 1.5 hours
	// 0.2 margin-left
	// 1.5 units
	// 0.5 margin
	// let totalWidth = $courseWidth;
	let elemWidth = 2.1;
	let prefShows = $prefs.courseTableData;
	$: {
		let w = 28.5;
		if (!prefShows.showWAYS) {
			w -= elemWidth * 2;
		}
		if (!prefShows.showExploreCoursesLink) {
			w -= elemWidth;
		}
		if (!prefShows.showCartaLink) {
			w -= elemWidth;
		}
		if (!prefShows.showAverageEval) {
			w -= elemWidth;
		}
		if (!prefShows.showPercentCompleted) {
			w -= elemWidth;
		}
		$courseWidth = w;
	}
</script>

<section style={`width: ${$courseWidth}em`}>
	<div class="leftSide">
		<div class="classDesc"><Text class="icon" size={iconSize} /></div>
		<div class="classCode">{course.Class}</div>
	</div>

	<div class="rightSide">
		{#if $prefs.courseTableData.showWAYS}
			<div class={'ways ways1 ' + aii(course['WAYS 1'])}>
				<WAYSIcon ways={aii(course['WAYS 1'])} />
			</div>
			<div class={'ways ways2 ' + aii(course['WAYS 2'])}>
				<WAYSIcon ways={aii(course['WAYS 2'])} />
			</div>
		{/if}
		{#if $prefs.courseTableData.showExploreCoursesLink}
			<div class="classLink">
				<a href={course.Link} target="_blank">
					<Link size={iconSize} />
				</a>
			</div>
		{/if}
		{#if $prefs.courseTableData.showPercentCompleted}
			<div class="percentCompleted" style={percentCompletedColor(course['Percent Completed'])}>
				{course['Percent Completed'] == -1 ? '' : course['Percent Completed']}
			</div>
		{/if}
		{#if $prefs.courseTableData.showAverageEval}
			<div class="averageEval" style={averageEvalColor(course['Average Eval'])}>
				{course['Average Eval'] == -1 ? '' : course['Average Eval']}
			</div>
		{/if}
		{#if $prefs.courseTableData.showCartaLink}
			<div class="classLink">
				<a href={course.Link} target="_blank">
					<Link class="icon" size={iconSize} />
				</a>
			</div>
		{/if}

		<div class="classHours">{course['Mean Hours'] == -1 ? 0 : course['Mean Hours']}</div>
		<div class="classUnits">{course['Units Ceiling']}</div>
	</div>
</section>

<style>
	section {
		box-sizing: border-box;
		text-align: left;

		border: 1px solid var(--color-text-light);
		border-radius: 1em;
		height: 1.8em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.leftSide {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		vertical-align: text-bottom;
		margin-left: 0.5em;
	}
	.leftSide > * {
		margin-right: 0.2em;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.classDesc {
		overflow: hidden;
		width: 1em;
		display: flex;
		flex-direction: column;
	}
	.classCode {
		/* Should be wide enough to fit 14 characters */
		min-width: 9em;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		justify-content: center;
	}

	.ways {
		margin-left: 0.2em;
		height: 1.2em;
		border-radius: 0.3em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.percentCompleted {
		border-radius: 0.3em;
		color: var(--color-text-dark);
	}
	.averageEval {
		border-radius: 0.3em;
		color: var(--color-text-dark);
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
		background-color: hsl(0, 100%, 50%);
	}
	.SMA {
		background-color: hsl(45, 100%, 50%);
	}
	.SI {
		background-color: hsl(70, 100%, 50%);
		color: var(--color-text-dark);
	}
	.AQR {
		background-color: hsl(135, 100%, 50%);
		color: var(--color-text-dark);
	}
	.CE {
		background-color: hsl(180, 100%, 50%);
		color: var(--color-text-dark);
	}
	.EDP {
		background-color: hsl(225, 100%, 50%);
	}
	.ER {
		background-color: hsl(270, 100%, 50%);
	}
	.FR {
		background-color: hsl(315, 100%, 50%);
	}
</style>
