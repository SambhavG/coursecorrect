<script>
	import { X } from 'lucide-svelte';
	import { showWelcomeModal, showWelcomeModalOnLoad } from '../stores';

	$: {
		$showWelcomeModal = $showWelcomeModalOnLoad;
	}

	function close() {
		$showWelcomeModal = false;
	}

	function dontShowAgain() {
		$showWelcomeModal = false;
		$showWelcomeModalOnLoad = false;
	}
</script>

{#if $showWelcomeModal}
	<div class="modal">
		<button class="close-button" on:click={close}>
			<X size="3em" />
		</button>
		<button class="dont-show-again-button" on:click={dontShowAgain}>Don't show again</button>
		<div>
			<h2>CourseCorrect</h2>
			<p>
				This is a 5 year course planner. Use in conjuction with other services (Explorecourses,
				Carta, etc.) for best results.
			</p>
			<h2>Start</h2>
			<p>
				Set your preferences, degree, and transfer units. Make sure to configure "Total" transfer
				units.
				<!-- Only a few
				popular degrees are implememented, but if you've taken CS 106B, you are more than capable of
				write a degree checking file yourself (in ~1 hour depending on how complex it is) and submit
				a pull request (<a
					href="https://github.com/SambhavG/coursecorrect/tree/main/src/routes/degrees"
					target="_blank"
				>
					src/routes/degrees
				</a>) -->
			</p>
			<p>
				Search for courses in the top left or directly enter them in each quarter. Use
				filters/sorting aggressively.
			</p>
			<h2>Star</h2>
			<p>Please star this project on Github if you found it helpful!</p>
			<div class="githubButton">
				<a
					class="github-button"
					href="https://github.com/sambhavg/coursecorrect"
					data-color-scheme="no-preference: light; light: light; dark: dark;"
					data-size="large"
					data-show-count="true"
					aria-label="Star sambhavg/coursecorrect on GitHub">Star</a
				>
			</div>
			<h2>Other info</h2>
			<p>
				CourseCorrect was made to be used full-screen on computers; if the site is jumbled, zoom
				out.
			</p>
			<p>
				If the entire website breaks, clear the cache and cookies. Site might be buggy on Safari.
			</p>
			<p>Data is stored locally on your browser. Export your data frequently.</p>
			<p>Degrees with more than 50 students/year are implemented.</p>
			<h2>Disclaimer</h2>
			<p>
				All data and calculations may contain errors. Consult official university materials for
				ground truths.
			</p>
			<p>There are no correctness guarantees.</p>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: relative;
		box-sizing: border-box;
		background-color: var(--color-text-light);
		padding: 4em 1em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		border-radius: 4em;
		font-size: 1.2em;
		margin-bottom: 1em;
	}
	.modal > * {
		color: var(--color-text-dark);
	}
	.close-button,
	.dont-show-again-button {
		background: var(--color-text-light);
		position: absolute;
		cursor: pointer;
	}
	.close-button {
		border: none;
		top: 5%;
		right: 5%;
	}
	.dont-show-again-button {
		bottom: 3%;
		left: 50%;
		transform: translateX(-50%);
		border: 1px solid var(--color-text-dark);
		padding: 0.5em 1em;
		border-radius: 4em;
		width: fit-content;
		font: inherit;
	}
</style>
