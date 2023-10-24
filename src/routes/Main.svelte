<script>
	import { dndzone } from 'svelte-dnd-action';
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
		searchFilters
	} from './stores.js';
	import Search from './components/Search.svelte';
	import WAYSTracker from './components/WAYSTracker.svelte';
	import Grid from './components/Grid.svelte';
	import GeneralizedDegreeTracker from './components/GeneralizedDegreeTracker.svelte';
	import CourseDataPanel from './components/CourseDataPanel.svelte';
	import Trash from './components/Trash.svelte';
	import ConfigPanel from './components/ConfigPanel.svelte';

	import { BSMathLUT, BSMath } from './degrees/BSMath.js';
	import { BSCSAILUT, BSCSAI } from './degrees/BSCSAI.js';
	import CourseRegexMatch from './degrees/CourseRegexMatch.js';
	import { X } from 'lucide-svelte';
	import { BSCSSystems, BSCSSystemsLUT } from './degrees/BSCSSystems.js';

	let mounted = false;
	let oneColumn = false;
	let overallStyle = '';
	$: {
		if ($isDragging) {
			overallStyle = 'overflow: hidden;';
			console.log('dragging');
		} else {
			overallStyle = '';
		}
		if (oneColumn) {
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

	let degreeTrackerData;

	function setDegreeSpecificSearchFilters(lutsInput) {
		//Reset it first
		$searchFilters.degreeSpecific = { checkboxes: {}, luts: {} };
		//For key in lut
		for (let key in lutsInput) {
			$searchFilters.degreeSpecific.luts[key] = CourseRegexMatch($allCourses, lutsInput[key]);
			$searchFilters.degreeSpecific.checkboxes[key] = false;
		}
		$searchFilters = $searchFilters;
	}

	$: {
		//Set
		let degreeTrackerFunction = null;
		let degreeFiltersFunction = null;
		switch ($prefs.bachelorsDegreeChoice) {
			case 0:
				degreeTrackerFunction = BSMath;
				degreeFiltersFunction = BSMathLUT;
				break;
			case 1:
				degreeTrackerFunction = BSCSAI;
				degreeFiltersFunction = BSCSAILUT;
				break;
			case 2:
				degreeTrackerFunction = BSCSSystems;
				degreeFiltersFunction = BSCSSystemsLUT;
				break;
		}
		degreeTrackerData = degreeTrackerFunction(
			$allCourses,
			$courseTable,
			$courseTableList,
			$prefs.transferUnits
		);
		setDegreeSpecificSearchFilters(degreeFiltersFunction());
	}

	let threshold = 100; // pixels from the bottom

	function handleMouseMove(event) {
		if (!$isDragging) {
			return;
		}
		let windowHeight = window.innerHeight;
		// console.log(event.clientY);
		// console.log(windowHeight - threshold);
		if (event.clientY > windowHeight - threshold) {
			console.log('scrolling');
			window.scrollBy(0, 10); // scroll down by 10 pixels
		}
	}

	$: {
		if ($prefs.panelCollapsed.search) {
			oneColumn = true;
		} else {
			oneColumn = false;
		}
	}

	let showModal = true;

	function close() {
		showModal = false;
	}
</script>

<!-- <svelte:window on:mousemove={handleMouseMove} /> -->

<!-- use:dndzone={{ items: [], dropFromOthersDisabled: true, dragDisabled: true }} -->
<section style={overallStyle}>
	{#if !$prefs.panelCollapsed.search}
		<div class="searchContainer">
			<Search />
		</div>
	{/if}
	<div class="gridAndInfoContainer">
		<!-- <div class="dataHeader" /> -->
		{#if showModal}
			<div class="modal">
				<button class="close-button" on:click={close}>
					<X size="3em" />
				</button>
				<div>
					<h2>Welcome to CourseCorrect</h2>
					<p>
						This is a 5 year course planning tool. It is specialized for long-term planning and is
						not a replacement for Explorecourses, Carta, or Oncourse but rather should be used
						alongside them. Ideally you should plan your current quarter first, then use this tool
						to plan all future years.
					</p>
					<h2>To start</h2>
					<p>
						Configure your preferences in the config panel, including your degree and transfer
						units. Only a few popular degrees are implememented, but if you've taken CS 106B, you
						are more than capable of write a degree checking file yourself (in ~1 hour depending on
						how complex it is) and submit a pull request (<a
							href="https://github.com/SambhavG/coursecorrect/tree/main/src/routes/degrees"
							target="_blank"
						>
							src/routes/degrees
						</a>)
					</p>
					<p>
						Search for courses in the top left or within each quarter. Search updates on keystroke
						and may take a moment to update. Use filters aggressively to find extremely particular
						courses.
					</p>
					<h2>Other info</h2>
					<p>
						CourseCorrect was made to be used full-screen on laptops; if the site is jumbled, zoom
						out.
					</p>
					<p>If the entire website breaks, clear your cache and cookies.</p>
					<p>Data is stored locally on your browser.</p>
					<p>
						The site is broken on Firefox (and potentially other browsers) because of how Github
						Pages handles hosting; use Chrome/Chromium-based browsers.
					</p>
					<h2>Disclaimer</h2>
					<p>
						All data and calculations may contain errors. Consult official university materials for
						ground truths.
					</p>
				</div>
			</div>
		{/if}
		<div class="dataHeader">
			<div class="waysTrackerContainer">
				<WAYSTracker />
			</div>
			<div class="generalizedDegreeTrackerContainer">
				<GeneralizedDegreeTracker data={degreeTrackerData} />
			</div>
			<div class="configPanelContain">
				<ConfigPanel />
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
		overflow: scroll;
	}

	.searchContainer {
		margin: 0 1em;
	}
	.gridAndInfoContainer {
		margin: 0 1em;
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

	.modal {
		position: relative;
		box-sizing: border-box;
		background-color: var(--color-text-light);
		padding: 4em 1em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		border-radius: 4em;
		font-size: 1.2em;
		margin-bottom: 1em;
	}
	.modal > * {
		color: var(--color-text-dark);
	}

	.close-button {
		border: none;
		background: var(--color-text-light);
		position: absolute;
		top: 5%;
		right: 5%;
		cursor: pointer;
	}
</style>
