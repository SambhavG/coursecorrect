<script>
	import { X } from 'lucide-svelte';
	import { showWelcomeModal, showWelcomeModalOnLoad } from '../stores';

	$: {
		$showWelcomeModal = $showWelcomeModalOnLoad && $showWelcomeModal;
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
			<h2>Welcome to CourseCorrect</h2>
			<p>
				This is a 5 year course planning tool. It is specialized for long-term planning and is not a
				replacement for Explorecourses, Carta, or Oncourse but rather should be used alongside them.
				Ideally you should plan your current quarter first, then use this tool to plan future years.
			</p>
			<h2>To start</h2>
			<p>
				Configure your preferences, degree, and transfer units in the config panel. Only a few
				popular degrees are implememented, but if you've taken CS 106B, you are more than capable of
				write a degree checking file yourself (in ~1 hour depending on how complex it is) and submit
				a pull request (<a
					href="https://github.com/SambhavG/coursecorrect/tree/main/src/routes/degrees"
					target="_blank"
				>
					src/routes/degrees
				</a>)
			</p>
			<p>
				Search for courses in the top left or within each quarter. Search updates on keystroke and
				may take a moment to update. Use filters aggressively to find extremely particular courses.
			</p>
			<h2>Other info</h2>
			<p>
				CourseCorrect was made to be used full-screen on laptops; if the site is jumbled, zoom out.
			</p>
			<p>If the entire website breaks, clear your cache and cookies.</p>
			<p>Data is stored locally on your browser.</p>
			<p>
				The site is broken on Firefox (and potentially other browsers) because of how Github Pages
				handles hosting; use Chrome/Chromium-based browsers.
			</p>
			<h2>Disclaimer</h2>
			<p>
				All data and calculations may contain errors. Consult official university materials for
				ground truths.
			</p>
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
