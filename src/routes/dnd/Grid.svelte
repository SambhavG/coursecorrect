<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, courseTable, searchResults } from '../stores.js';
	import Course from '../courseComponents/Course.svelte';

	const flipDurationMs = 200;

	function handleDndConsider(e, y, q) {
		$courseTable[y].quarters[q].courses = e.detail.items;
	}
	function handleDndFinalize(e, yearId, quarterId) {
		handleDndConsider(e, yearId, quarterId);
	}
	$: {
		console.log($courseTable);
	}
</script>

<section>
	{#each $courseTable as year, y (year.id)}
		<div class="yearContainer">
			{#each year.quarters as quarter, q (quarter.id)}
				<div class="quarterContainer">
					<div
						class="quarterDnd"
						use:dndzone={{ items: quarter.courses, flipDurationMs }}
						on:consider={(e) => handleDndConsider(e, y, q)}
						on:finalize={(e) => handleDndFinalize(e, y, q)}
					>
						{#each quarter.courses as course (course.id)}
							<div animate:flip={{ duration: flipDurationMs }}>
								<Course {course} />
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</section>

<style>
	section {
		padding: 0.3em;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
	}
	.yearContainer {
		display: flex;
		flex-direction: row;
		height: 200px;
	}
	.quarterContainer {
		border: 1px solid red;
	}
	.quarterDnd {
		display: flex;
		flex-direction: column;
		min-width: 10em;
		min-height: 10em;
	}
</style>
