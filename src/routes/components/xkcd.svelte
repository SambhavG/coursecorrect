<script>
	import { bachelorsDegreeChoice } from './../stores.js';

	let image = 'https://imgs.xkcd.com/comics/every_majors_terrible.png';

	let xkcdLut = {
		BioE: ['circumappendiceal_somectomy', 'flinch'],
		Biology: ['mushrooms', 'flinch', 'paper_title'],
		CS: [
			'the_general_problem',
			'not_really_into_pokemon',
			'code_quality',
			'travel_ghosts',
			'working_for_google',
			'compiling',
			'git_commit',
			'success',
			'future_self'
		],
		Econ: [
			'the_economic_argument',
			'money',
			'correlation',
			'peer_review',
			'investing',
			'advertising',
			'curve_fitting'
		],
		English: ['i_could_care_less', 'sustainable', 'etymonline', 'odyssey', 'bookstore'],
		Humbio: [
			'answers',
			'incision',
			'old_timers',
			'2024',
			'circumappendiceal_somectomy',
			'gut_fauna',
			'strengths_and_weaknesses',
			'advent',
			'sick_day',
			'coronavirus_research'
		],
		IR: ['terminology', 'congress', 'edge_cake', 'iceland'],
		Math: [
			'garbage_math',
			'convincing_pickup_line',
			'forgot_algebra',
			'proof',
			'polar_cartesian',
			'mobius_battle',
			'euler_diagrams',
			'math_paper',
			'set_theory'
		],
		MechE: [
			'quadcopter',
			'airaware',
			'my_phone_is_dying',
			'heat_pump',
			'engineering_hubris',
			'wing_lift',
			'work',
			'the_wrong_stuff'
		],
		'MS&E': ['spinal_tap_amps', 'engineering_hubris', 'engineer_syllogism', 'unicode', 'work'],
		Polisci: ['lincoln_douglas', 'congress', 'open_letter', 'chain_of_command'],
		Symsys: ['kites', 'engineer_syllogism', 'work', 'curve_fitting', 'the_wrong_stuff'],
		Physics: ['swingset', 'felsius', 'higgs_boson', 'interdisciplinary', 'flinch', 'heat_pump'],
		Psychology: ['interdisciplinary', 'walking_into_things', 'brain_worms', 'fmri'],
		other: ['in_your_classroom', 'every_majors_terrible', 'scientific_field_prefixes']
	};

	$: {
		try {
			let major = $bachelorsDegreeChoice.split('_')[2];
			//Random number from 0 to 10000
			let random = Math.floor(Math.random() * 10000);
			//Find first item in xkcdLut which $bachelorsDegreeChoice starts with
			let xkcdKey = Object.keys(xkcdLut).find((key) => major == key);
			if (!xkcdKey || xkcdLut[xkcdKey].length == 0) xkcdKey = 'other';
			//Random index is random % length of array
			let randomIndex = random % xkcdLut[xkcdKey].length;
			image = `https://imgs.xkcd.com/comics/${xkcdLut[xkcdKey][randomIndex]}.png`;
		} catch (e) {
			console.log(e);
		}
	}
</script>

<section>
	<img src={image} alt="XKCD comic" />
</section>

<style>
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	img {
		width: 20em;
	}
</style>
