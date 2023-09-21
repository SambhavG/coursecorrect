<script>
	import { dndzone } from 'svelte-dnd-action';
	import Search from './components/Search.svelte';
	import WAYSTracker from './components/WAYSTracker.svelte';
	import Grid from './components/Grid.svelte';
	import { onMount } from 'svelte';
	import {
		years,
		quarters,
		allCourses,
		courseTable,
		prefs,
		courseTableList,
		isDragging
	} from './stores.js';
	import data from './data/final_data_no_reviews.json';
	import GeneralizedDegreeTracker from './components/GeneralizedDegreeTracker.svelte';
	import CourseDataPanel from './components/CourseDataPanel.svelte';
	import { BSMathLUT, BSMath } from './degrees/BSMath.js';
	import Trash from './components/Trash.svelte';

	onMount(async () => {
		$allCourses = data;
		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
			$allCourses[i].ms = false;
			$allCourses[i].csnc = false;
			$allCourses[i].units_taking = $allCourses[i].max_units;
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
					for (let k = 0; k < j + 2; k++) {
						let randomCourse = $allCourses[Math.floor(Math.random() * $allCourses.length)];
						coursesObj[i].quarters[j].courses.push(randomCourse);
					}
				}
			}
			$courseTable = coursesObj;
		}
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

	$: {
		//Get all courses from courseTable and push to courseTableList
		let courseTableListItems = [];

		for (let i = 0; i < $courseTable.length; i++) {
			for (let j = 0; j < $courseTable[i].quarters.length; j++) {
				for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
					courseTableListItems.push($courseTable[i].quarters[j].courses[k]);
				}
			}
		}
		$courseTableList = courseTableListItems;
	}

	let threshold = 100; // pixels from the bottom

	function handleMouseMove(event) {
		if (!$isDragging) {
			return;
		}
		let windowHeight = window.innerHeight;

		if (event.clientY > windowHeight - threshold) {
			window.scrollBy(0, 20); // scroll down by 10 pixels
		}
	}

	function sectionStyle() {
		if ($prefs.searchCollapsed) {
			return 'grid-template-columns: minmax(0, 1fr);';
		} else {
			return 'grid-template-columns: minmax(0, 1fr) minmax(0, 3.1fr);';
		}
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

<section
	style={sectionStyle()}
	use:dndzone={{ items: [], dropFromOthersDisabled: true, dragDisabled: true }}
>
	{#if !$prefs.searchCollapsed}
		<div class="searchContainer">
			<Search />
		</div>
	{/if}
	<div class="gridAndInfoContainer">
		<div class="dataHeader">
			<div class="waysTrackerContainer">
				<WAYSTracker />
			</div>
			<div class="generalizedDegreeTrackerContainer">
				<GeneralizedDegreeTracker
					data={BSMath($allCourses, $courseTable, $courseTableList, {
						totalUnits: 30,
						APCalc: 10,
						additionalMath: 0
					})}
				/>
			</div>
		</div>
		<div class="courseDataPanelContainer">
			<CourseDataPanel />
		</div>
		<div class="gridContainer">
			<div class="trashContainer">
				<Trash />
			</div>
			<Grid />
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 3.1fr);
		overflow: scroll;
	}

	.searchContainer {
		margin: 0 1em;
	}
	.gridAndInfoContainer {
		margin: 0 1em;
		max-width: 100%;
	}
	.dataHeader {
		margin-bottom: 1em;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.waysTrackerContainer {
		margin-right: 1em;
	}
	.courseDataPanelContainer {
		width: 100%;
		margin-bottom: 1em;
	}
	.dataHeader {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.gridContainer {
		position: relative;
	}
	.trashContainer {
		position: absolute;
		top: 50%;
		left: 0%;
		/* the centerpoint of the object should be at the middle right */
		transform: translate(-100%, 0%);
		padding-right: 1em;
	}
</style>
