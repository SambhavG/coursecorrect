<script>
	import { onMount } from 'svelte';
	import Blank_degree from './Blank_degree.js';

	import _2023_UG_BioE_BS_Standard from './2023_UG_BioE_BS_Standard.js';

	import _2023_UG_Biology_BS_General from './2023_UG_Biology_BS_General.js';

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

	import _2023_UG_English_BA_Literature from './2023_UG_English_BA_Literature.js';

	import _2023_UG_Humbio_BA_Standard from './2023_UG_Humbio_BA_Standard.js';
	import _2023_UG_Humbio_BS_Standard from './2023_UG_Humbio_BS_Standard.js';

	import _2023_UG_IR_BA_Standard from './2023_UG_IR_BA_Standard.js';

	import _2023_UG_Math_BS_Standard from './2023_UG_Math_BS_Standard.js';

	import _2023_UG_MechE_BS_DynamicSystems from './2023_UG_MechE_BS_DynamicSystems.js';
	import _2023_UG_MechE_BS_Materials from './2023_UG_MechE_BS_Materials.js';
	import _2023_UG_MechE_BS_ProductRealization from './2023_UG_MechE_BS_ProductRealization.js';
	import _2023_UG_MechE_BS_ThermoFluidsHeat from './2023_UG_MechE_BS_ThermoFluidsHeat.js';

	import _2023_UG_MSnE_BS_Standard from './2023_UG_MS&E_BS_Standard.js';

	import _2023_UG_Polisci_BA_Standard from './2023_UG_Polisci_BA_Standard.js';

	import _2023_UG_Psychology_BA_Standard from './2023_UG_Psychology_BA_Standard.js';

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

	// grad

	import _2023_G_CS_MS_AI from './2023_G_CS_MS_AI.js';
	import _2023_G_CS_MS_Biocomp from './2023_G_CS_MS_Biocomp.js';
	import _2023_G_CS_MS_HCI from './2023_G_CS_MS_HCI.js';
	import _2023_G_CS_MS_Information from './2023_G_CS_MS_Information.js';
	import _2023_G_CS_MS_Security from './2023_G_CS_MS_Security.js';
	import _2023_G_CS_MS_SoftwareTheory from './2023_G_CS_MS_SoftwareTheory.js';
	import _2023_G_CS_MS_Systems from './2023_G_CS_MS_Systems.js';
	import _2023_G_CS_MS_Theory from './2023_G_CS_MS_Theory.js';
	import _2023_G_CS_MS_VisualComputing from './2023_G_CS_MS_VisualComputing.js';

	import { bachelorsDegreeChoices, mastersDegreeChoices } from '../stores.js';

	let ug_degrees = [
		Blank_degree,

		_2023_UG_BioE_BS_Standard,

		_2023_UG_Biology_BS_General,

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

		_2023_UG_English_BA_Literature,

		_2023_UG_Humbio_BA_Standard,
		_2023_UG_Humbio_BS_Standard,

		_2023_UG_IR_BA_Standard,

		_2023_UG_Math_BS_Standard,

		_2023_UG_MechE_BS_DynamicSystems,
		_2023_UG_MechE_BS_Materials,
		_2023_UG_MechE_BS_ProductRealization,
		_2023_UG_MechE_BS_ThermoFluidsHeat,

		_2023_UG_MSnE_BS_Standard,

		_2023_UG_Polisci_BA_Standard,

		_2023_UG_Psychology_BA_Standard,

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

	let masters_degrees = [
		Blank_degree,
		_2023_G_CS_MS_AI,
		_2023_G_CS_MS_Biocomp,
		_2023_G_CS_MS_HCI,
		_2023_G_CS_MS_Information,
		_2023_G_CS_MS_Security,
		_2023_G_CS_MS_SoftwareTheory,
		_2023_G_CS_MS_Systems,
		_2023_G_CS_MS_Theory,
		_2023_G_CS_MS_VisualComputing
	];

	onMount(async () => {
		$bachelorsDegreeChoices = ug_degrees;
		$mastersDegreeChoices = masters_degrees;
	});
</script>
