<script>
	import { onMount } from 'svelte';
	import Blank_degree from './Blank_degree.js';

	import _2023_UG_CS_BS_AI from './2023_UG_CS_BS_AI.js';
	import _2023_UG_CS_BS_Biocomp from './2023_UG_CS_BS_Biocomp.js';
	import _2023_UG_CS_BS_CompEng from './2023_UG_CS_BS_CompEng.js';
	import _2023_UG_CS_BS_Graphics from './2023_UG_CS_BS_Graphics.js';
	import _2023_UG_CS_BS_HCI from './2023_UG_CS_BS_HCI.js';
	import _2023_UG_CS_BS_Information from './2023_UG_CS_BS_Information.js';
	import _2023_UG_CS_BS_Systems from './2023_UG_CS_BS_Systems.js';
	import _2023_UG_CS_BS_Theory from './2023_UG_CS_BS_Theory.js';
	import _2023_UG_CS_BS_Unspecialized from './2023_UG_CS_BS_Unspecialized.js';

	import _2023_UG_Humbio_BA_Standard from './2023_UG_Humbio_BA_Standard.js';
	import _2023_UG_Humbio_BS_Standard from './2023_UG_Humbio_BS_Standard.js';

	import _2023_UG_Math_BS_Standard from './2023_UG_Math_BS_Standard.js';
	import { bachelorsDegreeChoices, mastersDegreeChoices } from '../stores.js';

	let ug_degrees = [
		Blank_degree,
		_2023_UG_CS_BS_AI,
		_2023_UG_CS_BS_Biocomp,
		_2023_UG_CS_BS_CompEng,
		_2023_UG_CS_BS_Graphics,
		_2023_UG_CS_BS_HCI,
		_2023_UG_CS_BS_Information,
		_2023_UG_CS_BS_Systems,
		_2023_UG_CS_BS_Theory,
		_2023_UG_CS_BS_Unspecialized,

		_2023_UG_Humbio_BA_Standard,
		_2023_UG_Humbio_BS_Standard,

		_2023_UG_Math_BS_Standard
	];
	let masters_degrees = [Blank_degree];

	onMount(async () => {
		$bachelorsDegreeChoices = ug_degrees;
		$mastersDegreeChoices = masters_degrees;
	});
</script>
