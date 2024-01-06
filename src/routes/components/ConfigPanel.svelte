<script>
	import {
		allCourses,
		bachelorsDegreeChoice,
		courseTable,
		prefs,
		quarters,
		years,
		panelCollapsed,
		bachelorsDegreeChoices,
		showWelcomeModalOnLoad,
		mastersDegreeChoice,
		compressedTable
	} from '../stores';
	import { tick } from 'svelte';

	function clearCourses() {
		let coursesObj = [];
		for (let i = 0; i < $years.length; i++) {
			coursesObj.push({ id: $years[i], quarters: [] });
			for (let j = 0; j < $quarters.length; j++) {
				coursesObj[i].quarters.push({ id: $years[i] + ' ' + $quarters[j], courses: [] });
			}
		}
		$courseTable = coursesObj;
	}
	//Data to download:
	// localStorage.setItem('compressedTable', JSON.stringify($compressedTable));
	// localStorage.setItem('years', JSON.stringify($years));
	// localStorage.setItem('quarters', JSON.stringify($quarters));
	// localStorage.setItem('prefs', JSON.stringify($prefs));
	// localStorage.setItem('showWelcomeModalOnLoad', JSON.stringify($showWelcomeModalOnLoad));
	// localStorage.setItem('panelCollapsed', JSON.stringify($panelCollapsed));
	// localStorage.setItem('bachelorsDegreeChoice', JSON.stringify($bachelorsDegreeChoice));
	// localStorage.setItem('mastersDegreeChoice', JSON.stringify($mastersDegreeChoice));

	function downloadData() {
		let data = {
			compressedTable: $compressedTable,
			years: $years,
			quarters: $quarters,
			prefs: $prefs,
			showWelcomeModalOnLoad: $showWelcomeModalOnLoad,
			panelCollapsed: $panelCollapsed,
			bachelorsDegreeChoice: $bachelorsDegreeChoice,
			mastersDegreeChoice: $mastersDegreeChoice
		};
		//Filename is coursecorrect_data_export_<date>.json
		let date = new Date();
		let dateString =
			date.getFullYear() +
			'-' +
			(date.getMonth() + 1).toString().padStart(2, '0') +
			'-' +
			date.getDate().toString().padStart(2, '0') +
			'_' +
			date.getHours().toString().padStart(2, '0') +
			'-' +
			date.getMinutes().toString().padStart(2, '0') +
			'-' +
			date.getSeconds().toString().padStart(2, '0');
		let fileName = 'coursecorrect_data_export_' + dateString + '.json';
		let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
		let dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute('href', dataStr);
		dlAnchorElem.setAttribute('download', fileName);
		dlAnchorElem.click();
	}

	function importData(e) {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.onload = (e) => {
			let data = JSON.parse(e.target.result);
			$compressedTable = data.compressedTable;
			$courseTable = $courseTable;
			$years = data.years;
			$quarters = data.quarters;
			$prefs = data.prefs;
			$showWelcomeModalOnLoad = data.showWelcomeModalOnLoad;
			$panelCollapsed = data.panelCollapsed;
			$bachelorsDegreeChoice = data.bachelorsDegreeChoice;
			$mastersDegreeChoice = data.mastersDegreeChoice;

			decompressCourses();
		};
		reader.readAsText(file);
	}

	//Copied over from main
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

	let showClearCoursesModal = false;
	let showClearEverythingModal = false;
	let selectedTransferUnit = 0;
</script>

<div class="content">
	<div class="title">Settings</div>
	<div class="exportAllData">
		<button on:click={downloadData}>Export data</button>
		<a id="downloadAnchorElem" style="display:none" />
	</div>
	<div class="importData">
		<button
			on:click={() => {
				document.getElementById('importDataInput').click();
			}}
		>
			Import data
		</button>
		<input id="importDataInput" type="file" style="display:none" on:change={importData} />
	</div>
	<div class="info">
		<b>All data is stored locally; export frequently</b>
	</div>
	<div class="showHideSearch">
		<button
			on:click={() => {
				$panelCollapsed.search = !$panelCollapsed.search;
				$panelCollapsed = $panelCollapsed;
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			{#if $panelCollapsed.search}
				Show search
			{:else}
				Hide search
			{/if}
		</button>
	</div>
	<div class="showHideSummer">
		<button
			on:click={() => {
				$panelCollapsed.summer = !$panelCollapsed.summer;
				$panelCollapsed = $panelCollapsed;
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			{#if $panelCollapsed.summer}
				Show summer
			{:else}
				Hide summer
			{/if}
		</button>
	</div>
	<div class="clearContainer">
		<button
			on:click={() => {
				showClearCoursesModal = !showClearCoursesModal;
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			Clear all courses
		</button>

		{#if showClearCoursesModal}
			<div class="clearCoursesModal">
				<div class="modal">
					<div class="modalContent">
						<div class="modalTitle">Clear all courses?</div>
						<div class="modalButtons">
							<button
								on:click={() => {
									clearCourses();
									showClearCoursesModal = false;
									const scrollPosition = document.scrollingElement.scrollTop;
									tick().then(() => {
										document.scrollingElement.scrollTop = scrollPosition;
									});
								}}
							>
								Yes
							</button>
							<button
								on:click={() => {
									showClearCoursesModal = false;
									const scrollPosition = document.scrollingElement.scrollTop;
									tick().then(() => {
										document.scrollingElement.scrollTop = scrollPosition;
									});
								}}
							>
								No
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class="header">Show course data</div>
	<div class="courseTableDataCheckboxes">
		{#each Object.keys($prefs.courseTableData) as courseTableData}
			<div class="checkbox">
				<input
					type="checkbox"
					bind:checked={$prefs.courseTableData[courseTableData]}
					on:change={() => {
						$prefs = $prefs;
					}}
				/>
				{courseTableData}
			</div>
		{/each}
	</div>
	<div class="transferUnits">
		<div class="header">Transfer units</div>
		<select
			on:change={(e) => {
				selectedTransferUnit = e.target.value;
			}}
		>
			{#each $prefs.transferUnits as transferUnit, i}
				<option value={i}>{transferUnit.name}</option>
			{/each}
		</select>
		<input
			class="transferUnitUnits"
			type="number"
			bind:value={$prefs.transferUnits[selectedTransferUnit].value}
			on:change={() => {
				$prefs = $prefs;
			}}
			placeholder="Transfer unit units"
		/>
	</div>
	<div class="info">
		<b> Set total transfer units, then AP units</b>
	</div>
	<div class="degreeCheckerConfig">
		<div class="header">Degree checker</div>
		<div class="bachelorsDegreeDropdown">
			<select
				on:change={(e) => {
					$bachelorsDegreeChoice = e.target.value;
				}}
				value={//Find the degree in $bachelorsDegreeChoices that matches $bachelorsDegreeChoice uniqueId
				$bachelorsDegreeChoices.find((choice) => choice.uniqueID === $bachelorsDegreeChoice)
					?.uniqueID}
			>
				{#each $bachelorsDegreeChoices as choice}
					<option value={choice.uniqueID}>{choice.degree}</option>
				{/each}
			</select>
		</div>
		<div class="info">
			<b>
				The degree checker is designed to cover the 80% most common cases. There are no accuracy
				guarantees; consult official materials.
			</b>
		</div>
		<div class="info">
			Implemented degrees include those which have 50 or more students per year. Implementations are
			at <a
				href="https://github.com/SambhavG/coursecorrect/tree/main/src/routes/degrees"
				target="_blank"
			>
				src/routes/degrees
			</a>
		</div>
	</div>
</div>

<style>
	.content {
		width: 25em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		padding: 0.5em;
	}
	.content > * {
		width: 100%;
	}
	.title {
		box-sizing: border-box;
		width: 100%;
		font-size: 2em;
		font-weight: bold;
		padding: 0.5em;
	}

	button {
		box-sizing: border-box;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
	}
	.header {
		font-size: 1.2em;
		font-weight: bold;
		margin: 0.5em 0;
	}

	.clearContainer,
	.showHideSummer,
	.importData {
		margin-top: 0.5em;
	}
	select {
		box-sizing: border-box;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
	}

	.transferUnitUnits {
		box-sizing: border-box;
		width: 4em;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
	}
	.info {
		margin: 0.5em 0;
	}

	.courseTableDataCheckboxes {
		padding: 0.5em 1em;
	}

	.courseTableDataCheckboxes > * {
		font-size: 1.2em;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
</style>
