<script>
	import { prefs } from './../stores.js';
	import { ArrowLeft, ArrowRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-svelte';
	import { courseTableList, WAYSTables } from '../stores.js';
	import WaysIcons from './WAYSIcons.svelte';
	import { tick } from 'svelte';
	//Determine WAYS fulfilled
	let waysGrids = [];
	let currentSolution = 0;
	let currentNumWaysFulfilled = 0;

	function numWaysFulfilled(ways) {
		if (!ways) {
			return 0;
		}
		let count = 0;
		for (let i = 0; i < ways.length; i++) {
			if (ways[i] == 'achieved') {
				count++;
			}
		}
		return count;
	}

	$: {
		if (currentSolution >= waysGrids.length) {
			currentSolution = 0;
		}
		currentNumWaysFulfilled = numWaysFulfilled(waysGrids[currentSolution]);
	}

	$: {
		//Extract list of WAYS
		let ways = [];

		//We need to deal with CE as a special case
		//Courses can either fulfill one CE (one units) or two CE (two + units)
		//However, the courses which are double listed for WAYS where one is CE are strictly two + units
		//So all we have to do is later on make sure when we add CE that it's always counting double
		//and in the present, double count CE when the course is singly listed for it and two+ units

		for (let i = 0; i < $courseTableList.length; i++) {
			let course = $courseTableList[i];
			if (course.ways.length > 0) {
				//Check if this is a two+ unit course with just CE
				if (course.ways.length == 1 && course.ways[0] == 'CE' && course.units_taking > 1) {
					ways.push(['CE']);
				}
				ways.push(course.ways);
			}
		}

		//Tally WAYS
		let baselineWAYS = {
			AII: { have: 0, need: 2 },
			SI: { have: 0, need: 2 },
			SMA: { have: 0, need: 2 },
			CE: { have: 0, need: 2 },
			AQR: { have: 0, need: 1 },
			EDP: { have: 0, need: 1 },
			ER: { have: 0, need: 1 },
			FR: { have: 0, need: 1 }
		};

		//Add all singletons
		ways
			.filter((way) => way.length == 1)
			.forEach((way) => {
				if (baselineWAYS[way[0]].have < baselineWAYS[way[0]].need) {
					baselineWAYS[way[0]].have++;
				}
			});
		ways = ways.filter((way) => way.length == 2);

		//Loop through double ways. If one of them is fulfilled, add other and pop it
		for (let i = 0; i < 1000; i++) {
			let notDiscard = [];
			let oldLength = ways.length;
			ways.forEach((way) => {
				let way1 = way[0];
				let needWay1 = baselineWAYS[way1].have < baselineWAYS[way1].need;
				let way2 = way[1];
				let needWay2 = baselineWAYS[way2].have < baselineWAYS[way2].need;

				//Discard these if not both are needed
				let discard = false;
				if (!(needWay1 && needWay2)) {
					discard = true;
				}
				if (needWay1 && !needWay2) {
					baselineWAYS[way1].have++;
					if (way1 == 'CE' && baselineWAYS['CE'].have == 1) {
						baselineWAYS['CE'].have++;
					}
				} else if (needWay2 && !needWay1) {
					baselineWAYS[way2].have++;
					if (way2 == 'CE' && baselineWAYS['CE'].have == 1) {
						baselineWAYS['CE'].have++;
					}
				}
				if (!discard) {
					notDiscard.push(way);
				}
			});
			ways = notDiscard;
			if (ways.length == oldLength) {
				break;
			}
		}

		//Compute all possible fillings
		let possibleFillings = [];
		possibleFillings.push(baselineWAYS);
		for (let i = 0; i < ways.length; i++) {
			let newFillings = [];
			possibleFillings.forEach((filling) => {
				let filling1 = JSON.parse(JSON.stringify(filling));
				let filling2 = JSON.parse(JSON.stringify(filling));
				let way1 = ways[i][0];
				let way2 = ways[i][1];
				if (filling1[way1].have < filling1[way1].need) {
					filling1[way1].have++;
					if (way1 == 'CE' && filling1['CE'].have == 1) {
						filling1['CE'].have++;
					}
					newFillings.push(filling1);
				}
				if (filling2[way2].have < filling2[way2].need) {
					filling2[way2].have++;
					if (way2 == 'CE' && filling2['CE'].have == 1) {
						filling2['CE'].have++;
					}
					newFillings.push(filling2);
				}
			});
			possibleFillings = newFillings;
			//Filter out duplicates
			possibleFillings = possibleFillings.filter((filling, index) => {
				let string = JSON.stringify(filling);
				return (
					possibleFillings.findIndex((filling2) => {
						return JSON.stringify(filling2) == string;
					}) == index
				);
			});
		}

		//Sort the possible fillings by number of ways fulfilled, then by farthest along in the list
		possibleFillings.sort((a, b) => {
			let aCount = 0;
			let bCount = 0;
			//By number of ways fulfilled
			for (const key of ['AII', 'SI', 'SMA', 'CE', 'AQR', 'EDP', 'ER', 'FR']) {
				aCount += a[key].have;
				bCount += b[key].have;
			}
			if (aCount > bCount) {
				return -1;
			}
			if (aCount < bCount) {
				return 1;
			}
			//By farthest along in the list
			for (const key of ['AII', 'SI', 'SMA', 'CE', 'AQR', 'EDP', 'ER', 'FR']) {
				if (a[key].have > b[key].have) {
					return -1;
				}
				if (a[key].have < b[key].have) {
					return 1;
				}
			}
			return 0;
		});

		//For key in baselineWAYS
		waysGrids = [];
		possibleFillings.forEach((filling) => {
			let waysGrid = [];
			for (const key of ['AII', 'SI', 'SMA', 'CE', 'AQR', 'EDP', 'ER', 'FR']) {
				for (let i = 0; i < filling[key].need; i++) {
					if (filling[key].have > i) {
						waysGrid.push('achieved');
					} else {
						waysGrid.push('notAchieved');
					}
				}
			}
			waysGrids.push(waysGrid);
		});
	}
</script>

<div class="content">
	<div class="title">WAYS</div>
	<div class="solutionTextContainer">
		<button
			on:click={() => {
				currentSolution--;
				if (currentSolution < 0) {
					currentSolution = waysGrids.length - 1;
				}
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			<ArrowLeft size="2em" style="cursor: pointer;" />
		</button>

		<div class="textStack">
			<div class="line1">
				Showing solution {currentSolution + 1} of {waysGrids.length}
			</div>
			<div class="line2">
				{currentNumWaysFulfilled}/12 WAYS fulfilled
			</div>
		</div>
		<button
			on:click={() => {
				currentSolution++;
				if (currentSolution >= waysGrids.length) {
					currentSolution = 0;
				}
				const scrollPosition = document.scrollingElement.scrollTop;
				tick().then(() => {
					document.scrollingElement.scrollTop = scrollPosition;
				});
			}}
		>
			<ArrowRight size="2em" style="cursor: pointer;" />
		</button>
	</div>
	<div class="table">
		<div class="row1">
			<div class={'AII AII1 ' + waysGrids[currentSolution][0]}>
				<div class="text">AII</div>
				<WaysIcons ways="AII" />
			</div>
			<div class={'AII AII1 ' + waysGrids[currentSolution][1]}>
				<div class="text">AII</div>
				<WaysIcons ways="AII" />
			</div>
			<div class={'SI SI1 ' + waysGrids[currentSolution][2]}>
				<div class="text">SI</div>
				<WaysIcons ways="SI" />
			</div>
			<div class={'SI SI2 ' + waysGrids[currentSolution][3]}>
				<div class="text">SI</div>
				<WaysIcons ways="SI" />
			</div>
		</div>
		<div class="row2">
			<div class={'SMA SMA1 ' + waysGrids[currentSolution][4]}>
				<div class="text">SMA</div>
				<WaysIcons ways="SMA" />
			</div>
			<div class={'SMA SMA2 ' + waysGrids[currentSolution][5]}>
				<div class="text">SMA</div>
				<WaysIcons ways="SMA" />
			</div>
			<div class={'CE CE1 ' + waysGrids[currentSolution][6]}>
				<div class="text">CE</div>
				<WaysIcons ways="CE" />
			</div>
			<div class={'CE CE2 ' + waysGrids[currentSolution][7]}>
				<div class="text">CE</div>
				<WaysIcons ways="CE" />
			</div>
		</div>
		<div class="row3">
			<div class={'AQR ' + waysGrids[currentSolution][8]}>
				<div class="text">AQR</div>
				<WaysIcons ways="AQR" />
			</div>
			<div class={'EDP ' + waysGrids[currentSolution][9]}>
				<div class="text">EDP</div>
				<WaysIcons ways="EDP" />
			</div>
			<div class={'ER ' + waysGrids[currentSolution][10]}>
				<div class="text">ER</div>
				<WaysIcons ways="ER" />
			</div>
			<div class={'FR ' + waysGrids[currentSolution][11]}>
				<div class="text">FR</div>
				<WaysIcons ways="FR" />
			</div>
		</div>
	</div>
</div>

<style>
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
		width: 20em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
	}
	.title {
		box-sizing: border-box;
		width: 100%;
		font-size: 2em;
		font-weight: bold;
		padding-top: 0.5em;
	}

	.solutionTextContainer {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 1.2em;
	}

	.solutionTextContainer > button {
		background-color: transparent;
		border: none;
		color: var(--color-text-light);
	}

	.table {
		width: 100%;
		display: grid;
	}
	.table > * {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
	.table > * > * {
		border-radius: 0.2em;
		margin: 0.25em;
		padding: 0.25em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.table > * > * > * {
		margin: 0.25em;
	}

	.notAchieved {
		/* background-color: var(--color-text-light); */
		color: var(--color-text-light);
		/* border: 1px solid var(--color-text-light); */
	}

	.AII {
		border: 1px solid var(--aii);
	}
	.SMA {
		border: 1px solid var(--sma);
	}
	.SI {
		border: 1px solid var(--si);
	}
	.AQR {
		border: 1px solid var(--aqr);
	}
	.CE {
		border: 1px solid var(--ce);
	}
	.EDP {
		border: 1px solid var(--edp);
	}
	.ER {
		border: 1px solid var(--er);
	}
	.FR {
		border: 1px solid var(--fr);
	}

	.AII.achieved {
		background-color: var(--aii);
		color: var(--aii-text);
	}
	.SMA.achieved {
		background-color: var(--sma);
		color: var(--sma-text);
	}
	.SI.achieved {
		background-color: var(--si);
		color: var(--si-text);
	}
	.AQR.achieved {
		background-color: var(--aqr);
		color: var(--aqr-text);
	}
	.CE.achieved {
		background-color: var(--ce);
		color: var(--ce-text);
	}
	.EDP.achieved {
		background-color: var(--edp);
		color: var(--edp-text);
	}
	.ER.achieved {
		background-color: var(--er);
		color: var(--er-text);
	}
	.FR.achieved {
		background-color: var(--fr);
		color: var(--fr-text);
	}
</style>
