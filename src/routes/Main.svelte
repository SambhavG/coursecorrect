<script>
	import Xkcd from './components/xkcd.svelte';
	import { onMount } from 'svelte';
	import {
		years,
		quarters,
		allCourses,
		reviewData,
		courseTable,
		prefs,
		courseTableList,
		isDragging,
		searchFilters,
		showWelcomeModalOnLoad,
		panelCollapsed,
		bachelorsDegreeChoice,
		bachelorsDegreeChoices,
		mastersDegreeChoice,
		mastersDegreeChoices,
		compiledDegree,
		compressedTable
	} from './stores.js';
	import Search from './components/Search.svelte';
	import WAYSTracker from './components/WAYSTracker.svelte';
	import Grid from './components/Grid.svelte';
	import GeneralizedDegreeTracker from './components/GeneralizedDegreeTracker.svelte';
	import CourseDataPanel from './components/CourseDataPanel.svelte';
	import Trash from './components/Trash.svelte';
	import ConfigPanel from './components/ConfigPanel.svelte';
	import OnStartInfoModal from './components/OnStartInfoModal.svelte';
	import PanelCollapseContainer from './components/PanelCollapseContainer.svelte';
	import LoadInAllDegrees from './degrees/LoadInAllDegrees.svelte';

	import GeneralizedDegreeCheck from './degrees/GeneralizedDegreeCheck.js';
	import compileDegree from './degrees/compileDegree.js';

	let mounted = false;
	let dumpLocalStorage = false;

	let overallStyle = '';
	$: {
		if ($isDragging) {
			overallStyle = 'overflow: hidden;';
		} else {
			overallStyle = '';
		}
		if ($panelCollapsed.search) {
			overallStyle += 'grid-template-columns: minmax(0, 1fr); width: 100%;';
		} else {
			overallStyle += 'grid-template-columns: minmax(0, 1fr) minmax(0, 3.1fr);';
		}
	}

	onMount(async () => {
		try {
			const res = await fetch('./final_data_no_reviews.json');
			$allCourses = await res.json();
			//Sort by course dept, then number, then modifier
			$allCourses.sort((a, b) => {
				if (a.dept != b.dept) {
					return a.dept.localeCompare(b.dept);
				}
				if (a.number != b.number) {
					return a.number - b.number;
				}
				if (a.modifier != b.modifier) {
					return a.modifier.localeCompare(b.modifier);
				}
			});
		} catch (err) {
			console.log(err);
		}

		let reviewDataPromise = Promise.all([
			fetch('./reviews/reviews0000.json'),
			fetch('./reviews/reviews1000.json'),
			fetch('./reviews/reviews2000.json'),
			fetch('./reviews/reviews3000.json'),
			fetch('./reviews/reviews4000.json'),
			fetch('./reviews/reviews5000.json'),
			fetch('./reviews/reviews6000.json'),
			fetch('./reviews/reviews7000.json'),
			fetch('./reviews/reviews8000.json'),
			fetch('./reviews/reviews9000.json'),
			fetch('./reviews/reviews10000.json'),
			fetch('./reviews/reviews11000.json'),
			fetch('./reviews/reviews12000.json'),
			fetch('./reviews/reviews13000.json')
		])
			.then((responses) => {
				return Promise.all(
					responses.map((response) => {
						return response.json();
					})
				);
			})
			.then((data) => {
				//Combine all reviews into one dict
				let allReviews = {};
				for (let i = 0; i < data.length; i++) {
					allReviews = { ...allReviews, ...data[i] };
				}
				return allReviews;
			})
			.catch((error) => {
				console.log(error);
			});

		reviewDataPromise.then((data) => {
			$reviewData = data;
		});

		for (let i = 0; i < $allCourses.length; i++) {
			$allCourses[i].id = i + '|' + Math.random().toString(36).substring(7);
			$allCourses[i].ms = false;
			$allCourses[i].csnc = false;
			$allCourses[i].units_taking = $allCourses[i].max_units;
			$allCourses[i].bump = 0; //Number of slots to bump this course down when tabulating degree
		}

		//Get data from local storage
		const isBrowser = typeof window !== 'undefined';
		let storedCompressedCourseTable = null;
		let storedPrefs = null;
		let storedShowWelcomeModalOnLoad = null;
		let storedPanelCollapsed = null;
		let storedBachelorsDegreeChoice = null;
		let storedMastersDegreeChoice = null;
		if (isBrowser && !dumpLocalStorage) {
			storedCompressedCourseTable = localStorage.getItem('compressedTable');
			storedPrefs = localStorage.getItem('prefs');
			storedShowWelcomeModalOnLoad = localStorage.getItem('showWelcomeModalOnLoad');
			storedPanelCollapsed = localStorage.getItem('panelCollapsed');
			storedBachelorsDegreeChoice = localStorage.getItem('bachelorsDegreeChoice');
			storedMastersDegreeChoice = localStorage.getItem('mastersDegreeChoice');
		}
		if (storedPrefs) {
			$prefs = JSON.parse(storedPrefs);
		}
		if (storedShowWelcomeModalOnLoad) {
			$showWelcomeModalOnLoad = JSON.parse(storedShowWelcomeModalOnLoad);
		} else {
			$showWelcomeModalOnLoad = true;
		}
		if (storedPanelCollapsed) {
			$panelCollapsed = JSON.parse(storedPanelCollapsed);
		}
		if (storedBachelorsDegreeChoice) {
			$bachelorsDegreeChoice = JSON.parse(storedBachelorsDegreeChoice);
		}
		if (storedMastersDegreeChoice) {
			$mastersDegreeChoice = JSON.parse(storedMastersDegreeChoice);
		}
		if (storedCompressedCourseTable && storedCompressedCourseTable !== '[]') {
			$compressedTable = JSON.parse(storedCompressedCourseTable);
			decompressCourses();
			cleanCourseTable();
		} else {
			let coursesObj = [];
			for (let i = 0; i < $years.length; i++) {
				coursesObj.push({ id: $years[i], quarters: [] });
				for (let j = 0; j < $quarters.length; j++) {
					coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
					for (let k = 0; k < 1; k++) {
						let randomCourse = $allCourses[Math.floor(Math.random() * $allCourses.length)];
						if (i == 0) {
							coursesObj[i].quarters[j].courses.push(randomCourse);
						}
					}
				}
			}
			$courseTable = coursesObj;
			compressCourses();
		}
		mounted = true;
	});

	//Save to local storage
	$: {
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser && mounted) {
			if ($compressedTable.length != 0) {
				localStorage.setItem('compressedTable', JSON.stringify($compressedTable));
			}
			localStorage.setItem('years', JSON.stringify($years));
			localStorage.setItem('quarters', JSON.stringify($quarters));
			localStorage.setItem('prefs', JSON.stringify($prefs));
			localStorage.setItem('showWelcomeModalOnLoad', JSON.stringify($showWelcomeModalOnLoad));
			localStorage.setItem('panelCollapsed', JSON.stringify($panelCollapsed));
			localStorage.setItem('bachelorsDegreeChoice', JSON.stringify($bachelorsDegreeChoice));
			localStorage.setItem('mastersDegreeChoice', JSON.stringify($mastersDegreeChoice));
		}
	}

	//Keep courseTableList updated
	$: {
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

	function setDegreeSpecificSearchFilters(compiledDegree) {
		$searchFilters.degreeSpecific = { checkboxes: {}, luts: {} };
		if (compiledDegree == {}) {
			return;
		}
		Object.keys(compiledDegree.lookuptables).forEach((key) => {
			$searchFilters.degreeSpecific.luts[key] = compiledDegree.lookuptables[key];
			$searchFilters.degreeSpecific.checkboxes[key] = false;
		});
		$searchFilters = $searchFilters;
	}

	//Used to remove error where one of the courses in courseTable has a dnd tag
	function cleanCourseTable() {
		for (let i = 0; i < $courseTable.length; i++) {
			for (let j = 0; j < $courseTable[i].quarters.length; j++) {
				for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
					//Delete the "isDndShadowItem" tag if it exists
					if ($courseTable[i].quarters[j].courses[k]?.isDndShadowItem != undefined) {
						delete $courseTable[i].quarters[j].courses[k].isDndShadowItem;
					}
				}
			}
		}
	}

	//This is the raw data passed to the degree check panel
	let degreeTrackerData;

	//Whenever the selected degree changes, recompile the degree
	$: {
		if ($bachelorsDegreeChoices.length !== 0) {
			let choiceFullDegree = $bachelorsDegreeChoices.find(
				(degree) => degree.uniqueID == $bachelorsDegreeChoice
			);
			$compiledDegree = compileDegree(choiceFullDegree, $allCourses);
			setDegreeSpecificSearchFilters($compiledDegree);
		}
	}

	//Whenever the course table changes, use the compiled degree to check it
	$: {
		//Load only once bachelorsDegreeChoices is loaded
		if ($bachelorsDegreeChoices.length !== 0) {
			degreeTrackerData = GeneralizedDegreeCheck(
				$compiledDegree,
				$allCourses,
				$courseTable,
				$courseTableList,
				$prefs.transferUnits
			);
		}
	}

	function compressCourses() {
		//Persistent:
		//code
		//bump
		//csnc
		//ms
		//units_taking
		$compressedTable = [];
		let coursesObj = [];
		for (let i = 0; i < $years.length; i++) {
			coursesObj.push({ id: $years[i], quarters: [] });
			for (let j = 0; j < $quarters.length; j++) {
				coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
				for (let k = 0; k < $courseTable[i].quarters[j].courses.length; k++) {
					let course = $courseTable[i].quarters[j].courses[k];
					let compressedCourse = {
						code: course.code,
						bump: course.bump,
						csnc: course.csnc,
						ms: course.ms,
						units_taking: course.units_taking
					};
					coursesObj[i].quarters[j].courses.push(compressedCourse);
				}
			}
		}
		$compressedTable = coursesObj;
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser && mounted) {
			if ($compressedTable.length != 0) {
				localStorage.setItem('compressedTable', JSON.stringify($compressedTable));
			}
		}
	}

	function decompressCourses() {
		$courseTable = [];
		let coursesObj = [];
		for (let i = 0; i < $years.length; i++) {
			coursesObj.push({ id: $years[i], quarters: [] });
			for (let j = 0; j < $quarters.length; j++) {
				coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
				for (let k = 0; k < $compressedTable[i].quarters[j].courses.length; k++) {
					let course = $compressedTable[i].quarters[j].courses[k];
					let decompressedCourse = $allCourses.find((c) => c.code == course.code);
					decompressedCourse = JSON.parse(JSON.stringify(decompressedCourse));
					decompressedCourse.bump = course.bump;
					decompressedCourse.csnc = course.csnc;
					decompressedCourse.ms = course.ms;
					decompressedCourse.units_taking = course.units_taking;
					decompressedCourse.id =
						decompressedCourse.id.split('|')[0] + '|' + Math.random().toString(36).substring(7);
					coursesObj[i].quarters[j].courses.push(decompressedCourse);
				}
			}
		}
		$courseTable = coursesObj;
	}

	//Whenever the course table changes, compress it
	$: {
		$courseTable = $courseTable;
		if ($courseTable.length != 0) {
			compressCourses();
		}
	}
</script>

<!-- <svelte:window on:mousemove={handleMouseMove} /> -->

<!-- use:dndzone={{ items: [], dropFromOthersDisabled: true, dragDisabled: true }} -->
<LoadInAllDegrees />
<section style={overallStyle}>
	{#if !$panelCollapsed.search}
		<div class="searchContainer">
			<Search />
			<div class="scrollArea" />
		</div>
	{/if}
	<div class="gridAndInfoAndScrollContainer">
		<div class="scrollArea" />
		<div class="trashContainer">
			<Trash />
		</div>
		<div class="gridAndInfoContainer">
			<div class="dataHeader">
				<OnStartInfoModal />
				<div class="waysTrackerContainer">
					<PanelCollapseContainer panelId="ways" panelName={'WAYS'} content={WAYSTracker} />
				</div>
				<div class="generalizedDegreeTrackerContainer">
					{#if $bachelorsDegreeChoices.length == 0}
						<div class="title" />
					{:else}
						<PanelCollapseContainer
							panelId="generalizedDegreeTracker"
							panelName={'Degree Check'}
							content={GeneralizedDegreeTracker}
							props={{ data: degreeTrackerData }}
						/>
					{/if}
				</div>
				<div class="configPanelContainer">
					<PanelCollapseContainer panelId="config" panelName={'Settings'} content={ConfigPanel} />
				</div>
			</div>
			<div class="courseDataPanelContainer">
				<PanelCollapseContainer
					panelId="courseData"
					panelName={'Course Data'}
					content={CourseDataPanel}
				/>
			</div>
			<div class="gridContainer">
				<Grid />
			</div>
			<footer>
				<p>Made by <a href="https://sambhavg.github.io">Sambhav Gupta</a> with Svelte</p>
			</footer>
			<Xkcd />
			<div class="giantSpace" />
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		display: grid;
		overflow: hidden;
		max-height: 100vh;
		padding-top: 0.5em;
	}

	.searchContainer {
		padding-left: 1em;
		padding-top: 1em;
		padding-right: 2em;
		overflow: scroll;
		max-height: 100vh;
		display: flex;
		flex-direction: row;
		background-image: linear-gradient(
			to right,
			var(--color-text-dark) 99%,
			var(--color-text-light) 99%
		);
	}
	.scrollArea {
		width: 2em;
		height: inherit;
		opacity: 0.1;
	}
	.gridAndInfoAndScrollContainer {
		display: flex;
		flex-direction: row;
		overflow: scroll;
		max-height: 100vh;
		margin-right: 1em;
	}
	.gridAndInfoContainer {
		/* overflow: scroll; */
		/* max-height: 100vh; */
		width: 100%;
	}
	.dataHeader {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		flex-wrap: wrap;
	}
	.waysTrackerContainer {
		margin-right: 1em;
		margin-bottom: 1em;
	}
	.generalizedDegreeTrackerContainer {
		margin-right: 1em;
		margin-bottom: 1em;
	}
	.configPanelContainer {
		margin-bottom: 1em;
	}
	.courseDataPanelContainer {
		width: 100%;
		margin-bottom: 1em;
	}
	.gridContainer {
		position: relative;
	}
	.trashContainer {
		position: absolute;
		left: 5%;
		top: 50%;
		transform: translateY(-25%);
		/* background-color: red; */
		width: 15em;
		height: 15em;
		pointer-events: none;
	}
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.5em;
	}

	footer a {
		font-weight: bold;
	}
	.giantSpace {
		height: 50vh;
	}
</style>
