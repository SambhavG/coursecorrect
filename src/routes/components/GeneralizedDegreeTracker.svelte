<script>
	import { courseDataSlider, years, quarters } from './../stores.js';
	import { Info } from 'lucide-svelte';
	import '../styles.css';
	export let data;
	export let showSlider = false;

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
		/*
		@keyframes moveBackground {
			0% { background-position: 0% 50%; }
			100% { background-position: 100% 50%; }
		}

		.stripe-background {
			background: linear-gradient(45deg, black 25%, white 25%, white 50%, black 50%, black 75%, white 75%, white);
			background-size: 56.57px 56.57px;
			animation: moveBackground 2s linear infinite;
		}
		*/
		// if (!cell?.noBorder && !cell?.isTitle && !cell?.progress && !cell?.toggle) {
		// 	//If the cell is blank, make it black and gray diagonal stripes which move left to right.
		// 	if (!cell?.value) {
		// 		style +=
		// 			'background: linear-gradient(45deg, var(--color-text-dark) 35%, var(--color-text-light) 35%, var(--color-text-light) 50%, var(--color-text-dark) 50%, var(--color-text-dark) 85%, var(--color-text-light) 85%, var(--color-text-light)); background-size: 1.5em 1.5em; animation: moveBackground 2s linear infinite;';
		// 	}
		// }

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

	function handleSliderInput(event) {
		$courseDataSlider = parseInt(event.target.value);
	}

	function getQuarter(index) {
		for (let year of $years) {
			for (let quarter of $quarters) {
				if (index == 0) {
					return year + ' ' + quarter;
				}
				index--;
			}
		}
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
	{#if showSlider}
		<div class="row" style="grid-template-columns: 1.65fr 4fr">
			<div class="cell" style="height: 3em;">{getQuarter($courseDataSlider)}</div>
			<div class="cell" style="text-align: center; padding: .5em">
				<input
					type="range"
					min="0"
					max={$years.length * $quarters.length - 1}
					value={$years.length * $quarters.length - 1}
					on:input={handleSliderInput}
					class="slider"
				/>
			</div>
		</div>
	{/if}
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

	@keyframes moveBackground {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 100% 50%;
		}
	}

	.slider {
		-webkit-appearance: none;
		width: 100%;
		height: 15px;
		border-radius: 10px;
		/* background: linear-gradient(to right, #ff416c, #ff4b2b); */
		background: linear-gradient(to right, #022b8b, #37eeff);
		outline: none;
		/* opacity: 0.7; */
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #60bfff;
		cursor: pointer;
		border: 3px solid #022b8b;
	}

	.slider::-moz-range-thumb {
		width: 5px;
		height: 25px;
		border-radius: 15%;
		background: #60bfff;
		cursor: pointer;
		border: 3px solid #60bfff;
	}
</style>
