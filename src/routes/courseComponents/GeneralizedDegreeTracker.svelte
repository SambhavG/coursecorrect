<script>
	export let data = {};
	//Takes as prop an object describing
	//(1) what fields should be made
	//(2) how they should be filled out in this case
	//Each "implementation" (props provider) should figure out the slider levels

	//Layout:
	//props is an array, each corresponds to a row
	//Each row is an array of cells
	//Each cell has a "value"
	//Each cell optionally has a "toggle" t/f and a "progress" decimal
	//Each cell optionally has a "flexGrow" int (default 1)
	//Each cell optionally has an "isTitle" t/f

	//To show progress, we can
	//(1) toggle (whole thing turns green)
	//(2) progress bar (if toggle is false) with traffic light colors

	function generateCellStyle(cell) {
		let style = '';
		if (cell?.toggle) {
			style += 'background-color: --var(--color-good),';
		}
		if (cell?.flexgrow) {
			style += 'flex-grow: ' + cell.flex - grow + ',';
		} else {
			style += 'flex-grow: 1,';
		}
		if (cell?.isTitle) {
			style += 'font: bold';
		}
	}

	function generateProgressStyle(cell) {
		//Also need to generate color
		if (!cell?.toggle && cell?.progress) {
			return 'width: ' + cell.progress * 100 + '%';
		}
		return '';
	}
</script>

<section>
	{#each data.rows as row, i (i)}
		<div class="row">
			{#each row.cells as cell, j (j)}
				<div class="cell" style={'flex-grow: 1'}>
					{cell.value}
				</div>
				<div class="progressBar" style={generateProgressStyle(cell)} />
			{/each}
		</div>
	{/each}
</section>

<style>
	section {
		width: 100%;
		border: 1px solid var(--color-text-light);
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
	}
	.row {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: center;
	}
	.cell {
		/* flex grow provided by function */
		border: 1px solid white;
	}
	.progressBar {
		position: absolute;
	}
</style>
