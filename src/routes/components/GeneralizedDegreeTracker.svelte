<script>
	import { ChevronsDownUp, ChevronsUpDown, Info } from 'lucide-svelte';
	import '../styles.css';
	import { panelCollapsed } from '../stores';
	import { tick } from 'svelte';
	export let data;

	//Takes as prop an object describing
	//(1) what fields should be made
	//(2) how they should be filled out in this case
	//Each "implementation" (props provider) should figure out the slider levels

	//Layout:
	//props is an array, each corresponds to a row
	//Each row is an array of cells
	//Each cell has a "value"
	//Each cell optionally has a "toggle" t/f and a "progress" decimal
	//Each cell optionally has a "weight" int (default 1)
	//Each cell optionally has an "isTitle" t/f

	//To show progress, we can
	//(1) toggle (whole thing turns green)
	//(2) progress bar (if toggle is false) with traffic light colors

	function generateCellStyle(cell) {
		let style = '';
		if (cell?.toggle) {
			style += 'background-color: var(--color-good);';
		}
		if (cell?.isTitle) {
			style += 'font-weight: bold;';
			style += 'font-size: 2em;';
		}
		if (cell?.textAlign) {
			style += 'text-align: ' + cell.textAlign + ';';
		}
		if (!cell?.noBorder) {
			style += 'border: 1px solid var(--color-text-light);';
		}
		return style;
	}

	function generateProgressStyle(cell) {
		//Also need to generate color
		let style = '';
		if (!cell?.toggle && cell?.progress) {
			let progressVal = cell.progress;
			//If progressVal contains a / in the string, we need to parse it as a fraction
			if (typeof progressVal == 'string' && progressVal.includes('/')) {
				let [num, denom] = progressVal.split('/');
				progressVal = parseInt(num) / parseInt(denom);
			}
			style += 'width: ' + progressVal * 100 + '%; ';
			//Color based on progressVal
			// if (progressVal < 0.5) {
			// 	style += 'background-color: var(--color-bad);';
			// } else if (progressVal < 0.75) {
			// 	style += 'background-color: var(--color-okay);';
			// } else {
			// 	style += 'background-color: var(--color-good);';
			// }
			//Instead of hard coding the color, generate smooth gradient color from 0 (red) to 50 (yellow) to 100 (green)
			let redStop = 0;
			let yellowStop = 0.5;
			let greenStop = 1;
			let red = 255;
			let green = 0;
			let blue = 0;
			if (progressVal > yellowStop) {
				red = 255 - ((progressVal - yellowStop) / (greenStop - yellowStop)) * 255;
				green = 255;
			}
			if (progressVal > redStop && progressVal < yellowStop) {
				red = 255;
				green = (progressVal / yellowStop) * 255;
			}
			style +=
				'background-color: rgb(' +
				Math.round(red) +
				',' +
				Math.round(green) +
				',' +
				Math.round(blue) +
				');';
		}
		return style;
	}

	//Given a row, return a grid style which takes the "weight" of each cell into account
	function rowGridStyle(row) {
		let style = '';
		let totalWeight = 0;
		for (let cell of row.cells) {
			totalWeight += cell.weight || 1;
		}
		style += 'grid-template-columns: ';
		for (let cell of row.cells) {
			style += (cell.weight || 1) / totalWeight + 'fr ';
		}
		return style;
	}
</script>

<div class="content">
	{#each data.rows as row, i (i)}
		<div class="row" style={rowGridStyle(row)}>
			{#each row.cells as cell, j (j)}
				<div class="cell" style={generateCellStyle(cell)}>
					{cell.value ? cell.value : ''}
					{#if cell?.progress}
						<div class="progressBar" style={generateProgressStyle(cell)} />
					{/if}
					{#if cell?.info}
						<div class="infoIcon">
							<Info
								size="1.3em"
								on:click={() => {
									alert(cell.info);
								}}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 35em;
		/* height: 40em; */
		padding: 0.25em 0.25em;
	}
	.row {
		width: 100%;
		height: 100%;
		text-align: center;
		display: grid;
	}
	/* apply to all rows which aren't the first */

	.cell {
		/* flex grow provided by function */
		position: relative;
		/* border: 1px solid var(--color-text-light); */
		text-overflow: ellipsis;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 1.15em;
		margin: 0.25em 0.25em;
		font-weight: bold;
	}

	.progressBar {
		position: absolute;
		height: 20%;
		background-color: var(--color-good);
		bottom: 0;
		left: 0;
		z-index: -1;
	}
	.infoIcon {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
