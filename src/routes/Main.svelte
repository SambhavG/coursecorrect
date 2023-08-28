<script>
	import Search from './courseComponents/Search.svelte';
	import Grid from './dnd/Grid.svelte';
	import { onMount } from 'svelte';
	import { years, quarters, allCourses, courseTable, searchResults, prefs } from './stores.js';
	import data from './data/courseDataFile.csv';

	onMount(async () => {
		$allCourses = data;
		//For each course, add id equal to random
		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
		}

		//Get data from local storage
		const isBrowser = typeof window !== 'undefined';
		let storedCourseTable = null;
		let storedYears = null;
		let storedQuarters = null;
		let storedPrefs = null;
		if (isBrowser) {
			storedCourseTable = localStorage.getItem('courseTable');
			storedYears = localStorage.getItem('years');
			storedQuarters = localStorage.getItem('quarters');
			storedPrefs = localStorage.getItem('prefs');
		}
		if (storedYears) {
			$years = JSON.parse(storedYears);
		}
		if (storedQuarters) {
			$quarters = JSON.parse(storedQuarters);
		}
		if (storedPrefs) {
			$prefs = JSON.parse(storedPrefs);
		}

		if (storedCourseTable && storedCourseTable !== '[]') {
			$courseTable = JSON.parse(storedCourseTable);
		} else {
			let coursesObj = [];
			for (let i = 0; i < $years.length; i++) {
				coursesObj.push({ id: $years[i], quarters: [] });
				for (let j = 0; j < $quarters.length; j++) {
					coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
					for (let k = 0; k < 3; k++) {
						let randomCourse = $allCourses[Math.floor(Math.random() * $allCourses.length)];
						coursesObj[i].quarters[j].courses.push(randomCourse);
					}
				}
			}
			$courseTable = coursesObj;
		}
		$searchResults = $allCourses.slice(0, 10);
	});

	//Save to local storage
	$: {
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser) {
			if ($courseTable.length != 0) {
				localStorage.setItem('courseTable', JSON.stringify($courseTable));
			}
			localStorage.setItem('years', JSON.stringify($years));
			localStorage.setItem('quarters', JSON.stringify($quarters));
			localStorage.setItem('prefs', JSON.stringify($prefs));
		}
	}
</script>

<section>
	<div class="searchContainer">
		<Search />
	</div>
	<div class="gridContainer">
		<Grid />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		align-items: left;
		font-size: 12px;
	}
	.searchContainer {
		margin: 0 1em;
	}
	.gridContainer {
		margin: 0 1em;
	}
</style>
