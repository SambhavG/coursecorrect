<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { years, quarters, courseTable, searchResults } from '../stores.js';
	import Course from '../courseComponents/Course.svelte';

	const flipDurationMs = 200;

	function handleDndConsider(e, yearId, quarterId) {
		//Check if e.detail.items has any items without an id. If so, wrap them in an object
		//with an id equal to the Class of the course
		// let properItems = e.detail.items;
		// for (let i = 0; i < e.detail.items.length; i++) {
		// 	if (e.detail.items[i].id === undefined) {
		// 		properItems[i] = {
		// 			id: e.detail.items[i].Class,
		// 			courseData: e.detail.items[i]
		// 		};
		// 	}
		// }

		$courseTable = $courseTable.map((year) => {
			if (year.id === yearId) {
				return {
					quarters: year.quarters.map((quarter) => {
						if (quarter.id === quarterId) {
							return {
								courses: e.detail.items,
								...quarter
							};
						}
						return quarter;
					}),
					...year
				};
			}
			return year;
		});
		$courseTable = $courseTable;
	}
	function handleDndFinalize(e, yearId, quarterId) {
		handleDndConsider(e, yearId, quarterId);
	}
	$: {
		console.log($courseTable);
	}
</script>

<section>
	{#each $courseTable as year (year.id)}
		<div class="yearContainer">
			{#each year.quarters as quarter (quarter.id)}
				<div class="quarterContainer">
					<div
						class="quarterDnd"
						use:dndzone={{ items: quarter.courses, flipDurationMs }}
						on:consider={(e) => handleDndConsider(e, year.id, quarter.id)}
						on:finalize={(e) => handleDndFinalize(e, year.id, quarter.id)}
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
	}
</style>
