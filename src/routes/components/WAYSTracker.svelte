<script>
	import { courseTableList, WAYSTables } from '../stores.js';
	import WaysIcons from './WAYSIcons.svelte';
	//Determine WAYS fulfilled
	let waysGrid = [];
	$: {
		//Extract list of WAYS
		let ways = [];

		for (let i = 0; i < $courseTableList.length; i++) {
			let course = $courseTableList[i];
			let way = [];
			if (course['WAYS 1'] != '') {
				way.push(course['WAYS 1']);
			}
			if (course['WAYS 2'] != '') {
				way.push(course['WAYS 2']);
			}
			if (way.length > 0) {
				ways.push(way);
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

		//Repeat following operation 20 times:
		//Loop through double ways. If one of them is fulfilled, add other and pop it
		for (let i = 0; i < 20; i++) {
			let notDiscard = [];
			ways.forEach((way) => {
				let way1 = way[0];
				let needWay1 = baselineWAYS[way1].have < baselineWAYS[way1].need;
				let way2 = way[1];
				let needWay2 = baselineWAYS[way2].have < baselineWAYS[way2].need;
				let discard = false;
				if (needWay1 && !needWay2) {
					baselineWAYS[way1].have++;
					discard = true;
				} else if (needWay2 && !needWay1) {
					baselineWAYS[way1].have++;
					discard = true;
				} else if (!needWay1 && !needWay2) {
					discard = true;
				}
				if (!discard) {
					notDiscard.push(way);
				}
			});
			ways = notDiscard;
		}

		//For key in baselineWAYS
		waysGrid = [];
		for (const key of ['AII', 'SI', 'SMA', 'CE', 'AQR', 'EDP', 'ER', 'FR']) {
			for (let i = 0; i < baselineWAYS[key].need; i++) {
				if (baselineWAYS[key].have > i) {
					waysGrid.push('achieved');
				} else {
					waysGrid.push('notAchieved');
				}
			}
		}
	}
</script>

<section>
	<div class="title">WAYS</div>
	<div class="table">
		<div class="row1">
			<div class={'AII AII1 ' + waysGrid[0]}>
				<div class="text">AII</div>
				<WaysIcons ways="AII" />
			</div>
			<div class={'AII AII1 ' + waysGrid[1]}>
				<div class="text">AII</div>
				<WaysIcons ways="AII" />
			</div>
			<div class={'SI SI1 ' + waysGrid[2]}>
				<div class="text">SI</div>
				<WaysIcons ways="SI" />
			</div>
			<div class={'SI SI2 ' + waysGrid[3]}>
				<div class="text">SI</div>
				<WaysIcons ways="SI" />
			</div>
		</div>
		<div class="row2">
			<div class={'SMA SMA1 ' + waysGrid[4]}>
				<div class="text">SMA</div>
				<WaysIcons ways="SMA" />
			</div>
			<div class={'SMA SMA2 ' + waysGrid[5]}>
				<div class="text">SMA</div>
				<WaysIcons ways="SMA" />
			</div>
			<div class={'CE CE1 ' + waysGrid[6]}>
				<div class="text">CE</div>
				<WaysIcons ways="CE" />
			</div>
			<div class={'CE CE2 ' + waysGrid[7]}>
				<div class="text">CE</div>
				<WaysIcons ways="CE" />
			</div>
		</div>
		<div class="row3">
			<div class={'AQR ' + waysGrid[8]}>
				<div class="text">AQR</div>
				<WaysIcons ways="AQR" />
			</div>
			<div class={'EDP ' + waysGrid[9]}>
				<div class="text">EDP</div>
				<WaysIcons ways="EDP" />
			</div>
			<div class={'ER ' + waysGrid[10]}>
				<div class="text">ER</div>
				<WaysIcons ways="ER" />
			</div>
			<div class={'FR ' + waysGrid[11]}>
				<div class="text">FR</div>
				<WaysIcons ways="FR" />
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		border: 0.25em solid var(--color-text-light);
		margin: 1em 0;
		box-sizing: border-box;
	}
	.title {
		width: 100%;
	}
	.table {
		width: 100%;
		display: grid;
	}
	.table > * {
		display: flex;
		flex-direction: row;
	}
	.table > * > * {
		width: 25%;
		border-radius: 0.2em;
		margin: 0.25em;
		padding: 0.25em 0.5em;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.table > * > * > * {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
