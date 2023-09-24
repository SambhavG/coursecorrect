<script>
	import { ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import {
		allCourses,
		bachelorsDegreeChoices,
		courseTable,
		prefs,
		quarters,
		years
	} from '../stores';

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
	let showClearCoursesModal = false;
	let showClearEverythingModal = false;
	let selectedTransferUnit = 0;
</script>

<section>
	<button
		class="switchPanelButton"
		on:click={() => {
			$prefs.panelCollapsed.config = !$prefs.panelCollapsed.config;
		}}
	>
		{#if $prefs.panelCollapsed.config}
			<ChevronsUpDown />
		{:else}
			<ChevronsDownUp />
		{/if}
	</button>
	{#if !$prefs.panelCollapsed.config}
		<div class="content">
			<div class="title">Config panel</div>
			<div class="showHideSearch">
				<button
					on:click={() => {
						$prefs.panelCollapsed.search = !$prefs.panelCollapsed.search;
						$prefs = $prefs;
					}}
				>
					{#if $prefs.panelCollapsed.search}
						Show search
					{:else}
						Hide search
					{/if}
				</button>
			</div>
			<div class="clearContainer">
				<button
					on:click={() => {
						showClearCoursesModal = !showClearCoursesModal;
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
										}}
									>
										Yes
									</button>
									<button
										on:click={() => {
											showClearCoursesModal = false;
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
				{#each Object.keys($prefs.courseTableData) as courseTableData, i}
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
			<div class="degreeCheckerConfig">
				<div class="header">Degree checker</div>
				<div class="bachelorsDegreeDropdown">
					<select
						on:change={(e) => {
							$prefs.bachelorsDegreeChoice = parseInt(e.target.value);
							$prefs = $prefs;
						}}
						value={$prefs.bachelorsDegreeChoice}
					>
						{#each $bachelorsDegreeChoices as bachelorsDegreeChoice, i}
							<option value={i}>{bachelorsDegreeChoice}</option>
						{/each}
					</select>
				</div>
				<div class="info">
					<b>
						The degree checker does not consider edge cases, cross listed courses, C/SNC
						requirements, or double counting. Read your program sheet.</b
					>
				</div>
				<div class="info">
					If your degree is not listed and you've taken CS 106B, you can write it and submit a pull
					request: go to <a href="https://github.com/SambhavG/coursecorrect">
						src/routes/degrees
					</a> and read the existing implementations to see how.
				</div>
			</div>
		</div>
	{:else}
		<div class="hiddenNotif">Config hidden</div>
	{/if}
</section>

<style>
	section {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border: 0.25em solid var(--color-text-light);
	}

	.switchPanelButton {
		all: unset;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		border-style: none;
		border-right: 0.25em solid;
		padding: 0;
		width: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hiddenNotif {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		font-size: 1.5em;
	}

	.content {
		width: 25em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		padding: 0.25em;
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
