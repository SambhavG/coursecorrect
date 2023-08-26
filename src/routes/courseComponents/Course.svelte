<script>
	//Get "course" object prop
	export let course = {};

	import Fa from 'svelte-fa/src/fa.svelte';
	import { faLink } from '@fortawesome/free-solid-svg-icons/index.js';

	//The course object is a rounded rectangle with a "Class", "Link", and "Mean Hours"
</script>

<section>
	<div class="classCode">{course.Class}</div>
	<div class="classLink">
		<a href={course.Link} target="_blank">
			<Fa icon={faLink} />
		</a>
	</div>
	<div class="classHours">{course['Mean Hours']}</div>
</section>

<style>
	section {
		width: 15em;
		padding: 0.3em;
		border: 1px solid black;
		border-radius: 10px;
		overflow: scroll;
		height: 2em;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
</style>
