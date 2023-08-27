<script>
	export let ways = '';
	import {
		Flower2,
		Microscope,
		Users,
		Rocket,
		Music,
		BatteryCharging,
		TrainTrack,
		Dices
	} from 'lucide-svelte';
	let iconSize = '18';
	let smallerSize = '14';
</script>

{#if ways == 'AII'}
	<Flower2 size={iconSize} />
{:else if ways == 'SMA'}
	<Microscope size={iconSize} />
{:else if ways == 'SI'}
	<Users size={smallerSize} />
{:else if ways == 'AQR'}
	<Rocket size={smallerSize} />
{:else if ways == 'CE'}
	<Music size={iconSize} />
{:else if ways == 'EDP'}
	<BatteryCharging size={iconSize} />
{:else if ways == 'ER'}
	<TrainTrack size={iconSize} />
{:else if ways == 'FR'}
	<Dices size={iconSize} />
{:else}
	<div />
{/if}
