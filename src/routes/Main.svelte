<script>
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
		compiledDegree
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
		let storedCourseTable = null;
		let storedYears = null;
		let storedQuarters = null;
		let storedPrefs = null;
		let storedShowWelcomeModalOnLoad = null;
		let storedPanelCollapsed = null;
		let storedBachelorsDegreeChoice = null;
		let storedMastersDegreeChoice = null;
		if (isBrowser && !dumpLocalStorage) {
			storedCourseTable = localStorage.getItem('courseTable');
			storedYears = localStorage.getItem('years');
			storedQuarters = localStorage.getItem('quarters');
			storedPrefs = localStorage.getItem('prefs');
			storedShowWelcomeModalOnLoad = localStorage.getItem('showWelcomeModalOnLoad');
			storedPanelCollapsed = localStorage.getItem('panelCollapsed');
			storedBachelorsDegreeChoice = localStorage.getItem('bachelorsDegreeChoice');
			storedMastersDegreeChoice = localStorage.getItem('mastersDegreeChoice');
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
		if (storedShowWelcomeModalOnLoad) {
			$showWelcomeModalOnLoad = JSON.parse(storedShowWelcomeModalOnLoad);
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
		mounted = true;
	});

	//Save to local storage
	$: {
		const isBrowser = typeof window !== 'undefined';
		if (isBrowser && mounted) {
			if ($courseTable.length != 0) {
				localStorage.setItem('courseTable', JSON.stringify($courseTable));
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
		// console.log(compiledDegree);
		if (compiledDegree == {}) {
			return;
		}
		Object.keys(compiledDegree.lookuptables).forEach((key) => {
			$searchFilters.degreeSpecific.luts[key] = compiledDegree.lookuptables[key];
			$searchFilters.degreeSpecific.checkboxes[key] = false;
		});
		$searchFilters = $searchFilters;
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
					<PanelCollapseContainer panelId="config" panelName={'Config'} content={ConfigPanel} />
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
				<div class="trashContainer">
					<Trash />
				</div>
				<Grid />
			</div>
			<footer>
				<p>Made by <a href="https://www.sambhavg.github.io">Sambhav Gupta</a> with Svelte</p>
			</footer>
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
		margin-left: 1em;
		overflow: scroll;
		max-height: 100vh;
		display: flex;
		flex-direction: row;
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
	}
	.dataHeader {
		width: 100%;
		margin-bottom: 1em;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.waysTrackerContainer {
		margin-right: 1em;
	}
	.generalizedDegreeTrackerContainer {
		margin-right: 1em;
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
		top: 50%;
		left: 0%;
		/* the centerpoint of the object should be at the middle right */
		transform: translate(-100%, 0%);
		padding-right: 1em;
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
