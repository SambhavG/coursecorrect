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

	/*
	Data we want to show:
		- Course code
		- Course name
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
	<div class="courseCode">{course.Class}</div>
	<div class="courseName">{course.Name}</div>
	<div class="courseDesc">{course.Description}</div>
</section>

<style>
	section {
		box-sizing: border-box;
		display: block;
		border: 0.25em solid var(--color-text-light);
		padding: 1em;
		overflow-x: scroll;
		height: 20em;
		width: 100%;
	}
	section > * {
		width: 100%;
		text-align: center;
		flex: 0;
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
