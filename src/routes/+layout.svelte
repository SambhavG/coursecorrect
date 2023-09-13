<script>
	import Header from './Header.svelte';
	import './styles.css';
	import './fonts.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>Made by <a href="https://www.sambhavg.github.io">Sambhav Gupta</a> with Svelte</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		width: 100%;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.5em;
	}

	footer a {
		font-weight: bold;
	}
</style>
