<script>
	export let course = {};
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
	}
	section > * {
		width: 100%;
		text-align: center;
	}
	.courseCode {
		font-size: 3em;
		font-weight: bold;
	}
	.courseDesc {
		text-align: left;
	}
</style>
