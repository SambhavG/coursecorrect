<script>
	import { dndzone } from 'svelte-dnd-action';
	import Search from './components/Search.svelte';
	import WAYSTracker from './components/WAYSTracker.svelte';
	import Grid from './components/Grid.svelte';
	import { onMount } from 'svelte';
	import { years, quarters, allCourses, courseTable, prefs, courseTableList } from './stores.js';
	import data from './data/courseDataFile.csv';
	import GeneralizedDegreeTracker from './components/GeneralizedDegreeTracker.svelte';
	import CourseDataPanel from './components/CourseDataPanel.svelte';
	import { BSMathLUT, BSMath } from './degrees/BSMath.js';
	import Trash from './components/Trash.svelte';

	onMount(async () => {
		$allCourses = data;
		//Some transformations to make the data more workable
		//For each course, add id equal to random
		//Add UnitsTaking property equal to 'Units Ceiling'
		//Add 'WAYS' property equal to an empty array if 'WAYS 1' and 'WAYS 2' are empty, otherwise add an array with 'WAYS 1' and 'WAYS 2'
		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
			if ($allCourses[i]['WAYS 1'] == '') {
				$allCourses[i].WAYS = [];
			} else if ($allCourses[i]['WAYS 2'] == '') {
				$allCourses[i].WAYS = [$allCourses[i]['WAYS 1']];
			} else {
				$allCourses[i].WAYS = [$allCourses[i]['WAYS 1'], $allCourses[i]['WAYS 2']];
			}
			$allCourses[i].ms = false;
			$allCourses[i].csnc = false;
			//Split course number into department, number, and modifier
			let courseDept = $allCourses[i].Class.split(' ')[0];
			let courseNum = $allCourses[i].Class.split(' ')[1];
			let number = parseInt(courseNum.match(/\d+/)[0]);
			let modifier = courseNum.substring(number.length);
			$allCourses[i].dept = courseDept;
			$allCourses[i].number = number;
			$allCourses[i].modifier = modifier;
			//Parse units ceiling and floor
			$allCourses[i].unitsCeiling = parseInt($allCourses[i]['Units Ceiling']);
			$allCourses[i].unitsFloor = parseInt($allCourses[i]['Units Floor']);
			$allCourses[i].unitsTaking = $allCourses[i].unitsCeiling;
			//Rename 'Mean Hours' to hours and parse it
			$allCourses[i].hours = parseInt($allCourses[i]['Mean Hours']);
			//Same for 'Average Eval' but parse as float
			$allCourses[i].averageEval = parseFloat($allCourses[i]['Average Eval']);
			//Same for 'Percent Complete' as int
			$allCourses[i].percentCompleted = parseInt($allCourses[i]['Percent Completed']);
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

	function sectionStyle() {
		if ($prefs.searchCollapsed) {
			return 'grid-template-columns: minmax(0, 1fr);';
		} else {
			return 'grid-template-columns: minmax(0, 1fr) minmax(0, 3.1fr);';
		}
	}
</script>

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
