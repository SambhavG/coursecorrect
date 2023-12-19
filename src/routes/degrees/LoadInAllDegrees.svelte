<script>
	import { onMount } from 'svelte';
	import Blank_degree from './Blank_degree.js';
	import BS_CS_AI_UG_2023 from './BS_CS_AI_UG_2023.js';
	import {
		bachelorsDegreeChoices,
		mastersDegreeChoices,
		bachelorsDegreeChoice
	} from '../stores.js';

	let ug_degrees = [Blank_degree, BS_CS_AI_UG_2023];
	let masters_degrees = [Blank_degree];

	onMount(async () => {
		$bachelorsDegreeChoices = ug_degrees;
		$mastersDegreeChoices = masters_degrees;
	});
</script>
