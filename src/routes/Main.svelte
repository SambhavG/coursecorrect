<script>
	import Search from './components/Search.svelte';
	import WAYSTracker from './components/WAYSTracker.svelte';
	import Grid from './components/Grid.svelte';
	import { onMount } from 'svelte';
	import {
		years,
		quarters,
		allCourses,
		courseTable,
		searchResults,
		prefs,
		courseTableList,
		selectedCourse
	} from './stores.js';
	import data from './data/courseDataFile.csv';
	import GeneralizedDegreeTracker from './components/GeneralizedDegreeTracker.svelte';
	import { Tally1 } from 'lucide-svelte';
	import CourseDataPanel from './components/CourseDataPanel.svelte';

	onMount(async () => {
		$allCourses = data;
		//Some transformations to make the data more workable
		//For each course, add id equal to random
		//Add UnitsTaking property equal to 'Units Ceiling'
		//Add 'WAYS' property equal to an empty array if 'WAYS 1' and 'WAYS 2' are empty, otherwise add an array with 'WAYS 1' and 'WAYS 2'
		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
			$allCourses[i].unitsTaking = $allCourses[i]['Units Ceiling'];
			if ($allCourses[i]['WAYS 1'] == '') {
				$allCourses[i].WAYS = [];
			} else if ($allCourses[i]['WAYS 2'] == '') {
				$allCourses[i].WAYS = [$allCourses[i]['WAYS 1']];
			} else {
				$allCourses[i].WAYS = [$allCourses[i]['WAYS 1'], $allCourses[i]['WAYS 2']];
			}
			$allCourses[i].ms = false;
			$allCourses[i].snc = false;
		}
		//Sort the courses by department, number, and modifier (the part after the number)
		$allCourses.sort((a, b) => {
			let aDept = a.Class.split(' ')[0];
			let bDept = b.Class.split(' ')[0];
			let aClassNum = a.Class.split(' ')[1];
			let bClassNum = b.Class.split(' ')[1];
			let aNumber = parseInt(aClassNum.match(/\d+/)[0]);
			let bNumber = parseInt(bClassNum.match(/\d+/)[0]);
			let aModifier = aClassNum.substring(aNumber.length);
			let bModifier = bClassNum.substring(bNumber.length);
			if (aDept < bDept) {
				return -1;
			}
			if (aDept > bDept) {
				return 1;
			}
			if (aNumber < bNumber) {
				return -1;
			}
			if (aNumber > bNumber) {
				return 1;
			}
			if (aModifier < bModifier) {
				return -1;
			}
			if (aModifier > bModifier) {
				return 1;
			}
		});

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
</script>

<section>
	<div class="searchAndDegreeTrackerContainer">
		<div class="generalizedDegreeTrackerContainer">
			<GeneralizedDegreeTracker
				data={{
					rows: [
						{ cells: [{ value: 'Credits' }, { value: 1 }] },
						{ cells: [{ value: 'Credits' }, { value: 1 }, { value: 'Credits' }, { value: 1 }] },
						{ cells: [{ value: 'Credits' }, { value: 'Credits' }, { value: 'Credits' }] },
						{ cells: [{ value: 1 }, { value: 1 }, { value: 1 }] }
					]
				}}
			/>
		</div>
		<div class="searchContainer">
			<Search />
		</div>
	</div>
	<div class="gridAndInfoContainer">
		<div class="dataHeader">
			<div class="waysTrackerContainer">
				<WAYSTracker />
			</div>
			<div class="courseDataPanelContainer">
				<CourseDataPanel course={$selectedCourse} />
			</div>
		</div>
		<div class="gridContainer">
			<Grid />
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 3.5fr;
		/* font-size: 0.7rem; */
	}

	.searchAndDegreeTrackerContainer {
		margin: 0 1em;
	}
	.searchAndDegreeTrackerContainer > * {
		margin: 1em 0;
	}
	.gridAndInfoContainer {
		margin: 0 1em;
	}
	.dataHeader {
		margin-bottom: 1em;
	}
	.waysTrackerContainer {
		margin-right: 1em;
	}
	.courseDataPanelContainer {
		width: 100%;
	}
	.dataHeader {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
