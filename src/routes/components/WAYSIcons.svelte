<script>
	export let ways = '';
	import {
		Rocket,
		Music,
		TrainTrack,
		Zap,
		Sigma,
		Flower,
		FlaskConical,
		User,
		Contact2
	} from 'lucide-svelte';
	let iconSize = '18';
	let smallerSize = '18';
</script>

{#if ways == 'AII'}
	<Flower size={iconSize} />
{:else if ways == 'SMA'}
	<FlaskConical size={smallerSize} />
{:else if ways == 'SI'}
	<Contact2 size={smallerSize} />
{:else if ways == 'AQR'}
	<Rocket size={smallerSize} />
{:else if ways == 'CE'}
	<Music size={iconSize} />
{:else if ways == 'EDP'}
	<Zap size={iconSize} />
{:else if ways == 'ER'}
	<TrainTrack size={iconSize} />
{:else if ways == 'FR'}
	<Sigma size={iconSize} />
{:else}
	<div />
{/if}
