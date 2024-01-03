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

	import _2023_UG_Econ_BA_Standard from './2023_UG_Econ_BA_Standard.js';

	import _2023_UG_Humbio_BA_Standard from './2023_UG_Humbio_BA_Standard.js';
	import _2023_UG_Humbio_BS_Standard from './2023_UG_Humbio_BS_Standard.js';

	import _2023_UG_Math_BS_Standard from './2023_UG_Math_BS_Standard.js';

	import _2023_UG_Symsys_BS_AI from './2023_UG_Symsys_BS_AI.js';
	import _2023_UG_Symsys_BS_AppliedLogic from './2023_UG_Symsys_BS_AppliedLogic.js';
	import _2023_UG_Symsys_BS_Biomed from './2023_UG_Symsys_BS_Biomed.js';
	import _2023_UG_Symsys_BS_CognitiveScience from './2023_UG_Symsys_BS_CognitiveScience.js';
	import _2023_UG_Symsys_BS_ComputationalFoundations from './2023_UG_Symsys_BS_ComputationalFoundations.js';
	import _2023_UG_Symsys_BS_ComputationalSocialScience from './2023_UG_Symsys_BS_ComputationalSocialScience.js';
	import _2023_UG_Symsys_BS_ComputerMusic from './2023_UG_Symsys_BS_ComputerMusic.js';
	import _2023_UG_Symsys_BS_DecisionMakingAndRationality from './2023_UG_Symsys_BS_DecisionMakingAndRationality.js';
	import _2023_UG_Symsys_BS_HCI from './2023_UG_Symsys_BS_HCI.js';
	import _2023_UG_Symsys_BS_HumanCenteredAI from './2023_UG_Symsys_BS_HumanCenteredAI.js';
	import _2023_UG_Symsys_BS_Learning from './2023_UG_Symsys_BS_Learning.js';
	import _2023_UG_Symsys_BS_MathematicalFoundations from './2023_UG_Symsys_BS_MathematicalFoundations.js';
	import _2023_UG_Symsys_BS_MediaAndCommunication from './2023_UG_Symsys_BS_MediaAndCommunication.js';
	import _2023_UG_Symsys_BS_NaturalLanguage from './2023_UG_Symsys_BS_NaturalLanguage.js';
	import _2023_UG_Symsys_BS_Neuroscience from './2023_UG_Symsys_BS_Neuroscience.js';
	import _2023_UG_Symsys_BS_PhilosophicalFoundations from './2023_UG_Symsys_BS_PhilosophicalFoundations.js';

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
		_2023_UG_Econ_BA_Standard,

		_2023_UG_Humbio_BA_Standard,
		_2023_UG_Humbio_BS_Standard,

		_2023_UG_Math_BS_Standard,

		_2023_UG_Symsys_BS_AI,
		_2023_UG_Symsys_BS_AppliedLogic,
		_2023_UG_Symsys_BS_Biomed,
		_2023_UG_Symsys_BS_CognitiveScience,
		_2023_UG_Symsys_BS_ComputationalFoundations,
		_2023_UG_Symsys_BS_ComputationalSocialScience,
		_2023_UG_Symsys_BS_ComputerMusic,
		_2023_UG_Symsys_BS_DecisionMakingAndRationality,
		_2023_UG_Symsys_BS_HCI,
		_2023_UG_Symsys_BS_HumanCenteredAI,
		_2023_UG_Symsys_BS_Learning,
		_2023_UG_Symsys_BS_MathematicalFoundations,
		_2023_UG_Symsys_BS_MediaAndCommunication,
		_2023_UG_Symsys_BS_NaturalLanguage,
		_2023_UG_Symsys_BS_Neuroscience,
		_2023_UG_Symsys_BS_PhilosophicalFoundations
	];

	let masters_degrees = [Blank_degree];

	onMount(async () => {
		$bachelorsDegreeChoices = ug_degrees;
		$mastersDegreeChoices = masters_degrees;
	});
</script>
