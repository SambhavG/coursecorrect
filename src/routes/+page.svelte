<script>
	import { onMount } from 'svelte';
	import Main from './Main.svelte';

	let width = 0;

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
	{#if width < 1000}
		<h1>CourseCorrect only works on desktop.</h1>
	{:else}
		<Main />
	{/if}
</section>

<style>
	section {
		width: 100%;
	}

	h1 {
		text-align: center;
		margin-top: 20%;
		font-size: 4rem;
	}
</style>
