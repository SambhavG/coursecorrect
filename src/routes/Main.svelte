<script>
	//This file contains the main layout of the app
	//Left panel is search + statistics, right is dnd
	import Search from './courseComponents/Search.svelte';
	import Grid from './dnd/Grid.svelte';
	// import { years, quarters, courses } from './stores.js';

	// function cleanUpCourses() {
	// 	for (let i = 0; i < courses.length; i++) {
	// 		for (let j = 0; j < courses[i].quarters.length; j++) {
	// 			for (let k = 0; k < courses[i].quarters[j].courses.length; k++) {
	// 				if (courses[i].quarters[j].courses[k] === undefined) {
	// 					courses[i][j].splice(k, 1);
	// 					k--;
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	import { onMount } from 'svelte';
	import { years, quarters, allCourses, courseTable, searchResults } from './stores.js';
	import data from './data/courseDataFile.csv';
	onMount(async () => {
		$allCourses = data;
		//For each course, add id equal to random
		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
		}

		let coursesObj = [];
		for (let i = 0; i < $years.length; i++) {
			coursesObj.push({ id: $years[i], quarters: [] });
			for (let j = 0; j < $quarters.length; j++) {
				coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
				for (let k = 0; k < 3; k++) {
					let randomCourse = $allCourses[Math.floor(Math.random() * $allCourses.length)];
					// coursesObj[i].quarters[j].courses.push({
					// 	id: randomCourse.Class,
					// 	courseData: randomCourse
					// });
					coursesObj[i].quarters[j].courses.push(randomCourse);
				}
			}
		}
		$courseTable = coursesObj;
		console.log($courseTable);
		$searchResults = $allCourses.slice(0, 10);
	});
</script>

<section>
	<div class="row">
		<div class="column">
			<Search />
		</div>
		<div class="column">
			<Grid />
		</div>
	</div>
</section>

<style>
	.row {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.column {
		flex: 50%;
		padding: 10px;
	}
</style>