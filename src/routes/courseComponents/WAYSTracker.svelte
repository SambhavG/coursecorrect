<script>
	import { courseTableList, WAYSTables } from '../stores.js';
	import WaysIcons from './WAYSIcons.svelte';
	import waysIcons from './WAYSIcons.svelte';
	//Determine WAYS fulfilled

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
			SMA: { have: 0, need: 2 },
			SI: { have: 0, need: 2 },
			AQR: { have: 0, need: 1 },
			CE: { have: 0, need: 1 },
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
		console.log(ways);
	}
</script>

<section>
	<div class="title">WAYS</div>
	<div class="table">
		<div class="row1">
			<div class="AII AII1">AII <WaysIcons ways="AII" /></div>
			<div class="AII"><WaysIcons ways="AII" /></div>
			<div class="SI"><WaysIcons ways="SI" /></div>
			<div class="SI"><WaysIcons ways="SI" /></div>
		</div>
		<div class="row2">
			<div class="SMA"><WaysIcons ways="SMA" /></div>
			<div class="SMA"><WaysIcons ways="SMA" /></div>
			<div class="CE"><WaysIcons ways="CE" /></div>
			<div class="CE"><WaysIcons ways="CE" /></div>
		</div>
		<div class="row3">
			<div class="AQR"><WaysIcons ways="AQR" /></div>
			<div class="EDP"><WaysIcons ways="EDP" /></div>
			<div class="ER"><WaysIcons ways="ER" /></div>
			<div class="FR"><WaysIcons ways="FR" /></div>
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
		background-color: red;
		border-radius: 0.2em;
		margin: 0.25em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.AII {
		background-color: var(--aii);
		color: var(--aii-text);
	}
	.SMA {
		background-color: var(--sma);
		color: var(--sma-text);
	}
	.SI {
		background-color: var(--si);
		color: var(--si-text);
	}
	.AQR {
		background-color: var(--aqr);
		color: var(--aqr-text);
	}
	.CE {
		background-color: var(--ce);
		color: var(--ce-text);
	}
	.EDP {
		background-color: var(--edp);
		color: var(--edp-text);
	}
	.ER {
		background-color: var(--er);
		color: var(--er-text);
	}
	.FR {
		background-color: var(--fr);
		color: var(--fr-text);
	}
</style>
