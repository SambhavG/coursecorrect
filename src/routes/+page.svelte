<script>
	import { onMount } from 'svelte';
	import Main from './Main.svelte';

	let width = 1500;
	let hide = false;

	//On load, get the width of the window and set it to the width variable
	//Change the width variable when the window is resized
	onMount(() => {
		width = window.innerWidth;
		window.addEventListener('resize', () => {
			width = window.innerWidth;
		});
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if width < 1200 && !hide}
		<h1>
			CourseCorrect was made for 💻 🖥️ and may need a bigger screen to display properly! Please use
			a bigger screen or zoom out.
		</h1>
		<button on:click={() => (hide = true)}>Hide</button>
	{/if}
	<Main />
</section>

<style>
	section {
		width: 100%;
	}

	h1 {
		text-align: center;
		margin: 5% 10%;
		margin-bottom: 1%;
		font-size: 3rem;
	}

	button {
		width: 30%;
		margin: 2% 35%;
		box-sizing: border-box;
		height: 1.8em;
		font-size: 1.2em;
		padding-left: 0.5em;
		margin-right: 0.5em;
		border: 1px solid #ccc;
		border-radius: 1em;
		background-color: var(--color-text-dark);
		color: var(--color-text-light);
		font-family: var(--font-mono);
	}
</style>
