<script>
	import { max } from './../../../../node_modules/d3-chord/src/math.js';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faLink } from '@fortawesome/free-solid-svg-icons/index.js';
	import { prefs } from '../stores.js';
	export let course = {};
</script>

<section>
	<div class="leftSide">
		<div class="classCode">{course.Class}</div>
		<div class="classDesc">{course.Description}</div>
	</div>

	<div class="rightSide">
		{#if $prefs.courseTableData.showCartaLink}
			<div class="classLink">
				<a href={course.Link} target="_blank">
					<Fa icon={faLink} />
				</a>
			</div>
		{/if}
		<div class="classHours">{course['Mean Hours']}</div>
		<div class="classUnits">{course['Units Ceiling']}</div>
	</div>
</section>

<style>
	section {
		font-size: 0.8em;
		box-sizing: border-box;
		width: 25em;
		/* padding: 0.3em; */
		padding: 0 0.6em;
		text-align: left;

		border: 1px solid black;
		border-radius: 10px;
		height: 1.5em;
		display: flex;
		flex-direction: row;
		font-family: 'Fira mono';
		justify-content: space-between;
	}

	.leftSide {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: white;
		vertical-align: text-bottom;
	}
	.classCode {
		/* Should be wide enough to fit 14 characters */
		min-width: 9em;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.classDesc {
		overflow: hidden;
		max-width: 5em;
		background-color: aqua;
	}

	.rightSide {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 10em;
		justify-content: right;
	}

	.rightSide > * {
		width: 2em;
		text-align: right;
	}

	@font-face {
		font-family: 'ttnormsproThin';
		src: url('../../../static/fonts/TT\ Norms\ Pro\ Thin.otf');
	}
</style>
