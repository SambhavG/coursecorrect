<script>
	import { allCourses, courseTable, prefs, quarters, years } from '../stores';
	// let customCourse = {};
	// let customCourseKeys = [];
	// let selectedKey = 0;
	// let addCourseInput = '';
	// $: {
	// 	//Update customCourse to first elem of allCourses when allCourses is loaded
	// 	if ($allCourses.length > 0) {
	// 		customCourse = { ...$allCourses[0] };
	// 		customCourseKeys = Object.keys(customCourse);
	// 	}
	// }

	// function handleAddCourseDropdownChange(e) {
	// 	selectedKey = e.target.value;
	// 	addCourseInput = customCourse[customCourseKeys[selectedKey]];
	// }

	// function handleAddCourseInputChange(e) {
	// 	let val = e.target.value;
	// 	//If courseInput looks like a number, convert it
	// 	if (!isNaN(val)) {
	// 		val = Number(val);
	// 	}
	// 	//If courseInput looks like a boolean, convert it
	// 	if (val === 'true') {
	// 		val = true;
	// 	}
	// 	if (val === 'false') {
	// 		val = false;
	// 	}
	// 	//If courseInput looks like a json, convert it
	// 	if (val.startsWith('{') && val.endsWith('}')) {
	// 		try {
	// 			val = JSON.parse(val);
	// 		} catch (e) {}
	// 	}
	// 	if (val.startsWith('[') && val.endsWith(']')) {
	// 		try {
	// 			val = JSON.parse(val);
	// 		} catch (e) {}
	// 	}

	// 	let key = customCourseKeys[selectedKey];
	// 	customCourse[key] = val;
	// }

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
	<div class="title">Config panel</div>
	<div class="darkModeLightMode">
		<button
			on:click={() => {
				$prefs.darkMode = !$prefs.darkMode;
			}}
		>
			Toggle light mode
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
		<button
			on:click={() => {
				showClearEverythingModal = !showClearEverythingModal;
			}}
		>
			Clear everything
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
		{#if showClearEverythingModal}
			<div class="clearEverythingModal">
				<div class="modal">
					<div class="modalContent">
						<div class="modalTitle">Clear everything?</div>
						<div class="modalButtons">
							<button
								on:click={() => {
									clearCourses();
									showClearEverythingModal = false;
								}}
							>
								Yes
							</button>
							<button
								on:click={() => {
									showClearEverythingModal = false;
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
			type="number"
			bind:value={$prefs.transferUnits[selectedTransferUnit].value}
			on:change={() => {
				$prefs = $prefs;
			}}
			placeholder="Transfer unit units"
		/>
	</div>
	<!-- <div class="createCustomCourse">
		<div class="header">Create custom course</div>
		<div class="div">(Change parameters as desired)</div>
		<select bind:value={selectedKey} on:change={handleAddCourseDropdownChange}>
			{#each customCourseKeys as key, i}
				<option value={i}>{key.replaceAll('_', ' ')}</option>
			{/each}
		</select>
		<input
			type="text"
			bind:value={addCourseInput}
			on:change={handleAddCourseInputChange}
			placeholder="Data value"
		/>
		<button
			on:click={() => {
				$allCourses.push(customCourse);
				customCourse = { ...$allCourses[0] };
				customCourseKeys = Object.keys(customCourse);
			}}
		>
			Create
		</button>
	</div> -->
</section>

<style>
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		border: 0.25em solid var(--color-text-light);
		box-sizing: border-box;
		padding: 0.25em;
	}
	section > * {
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

	input {
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
</style>
