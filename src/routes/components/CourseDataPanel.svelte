<script>
	import { allCourses } from '../stores';
	export let course = {};

	//Set default value on load
	$: {
		let firstCourse = $allCourses.find((c) => c.Class === 'CS 106A');
		firstCourse = $allCourses[0];
		if (firstCourse && !course.Class) {
			course = firstCourse;
		}
	}
</script>

<section>
	<div class="courseCode">{course.Class}</div>
	<div class="courseName">{course.Name}</div>
	<div class="courseDesc">{course.Description}</div>
</section>

<style>
	section {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		border: 0.25em solid var(--color-text-light);
		width: 30em;
		padding: 1em;
		overflow-x: scroll;
	}
	section > * {
		width: 100%;
		text-align: center;
	}
	.courseCode {
		font-size: 3em;
		font-weight: bold;
	}
	.courseName {
		font-size: 2em;
		font-weight: bold;
		margin: 0.5em 0;
	}
	.courseDesc {
		text-align: left;
	}
</style>
