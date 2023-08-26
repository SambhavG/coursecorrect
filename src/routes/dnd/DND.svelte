<script>
	import VerticalList from './VerticalList.svelte';
	import HorizontalList from './HorizontalList.svelte';
	import Grid from './Grid.svelte';
	import Board from './Board.svelte';
	import Search from '../courseComponents/Search.svelte';

	let items1 = [
		{ id: 11, name: 'item11' },
		{ id: 12, name: 'item12' },
		{ id: 13, name: 'item13' },
		{ id: 14, name: 'item14' },
		{ id: 15, name: 'item15' },
		{ id: 16, name: 'item16' },
		{ id: 17, name: 'item17' }
	];
	let items2 = [
		{ id: 21, name: 'item21' },
		{ id: 22, name: 'item22' },
		{ id: 23, name: 'item23' },
		{ id: 24, name: 'item24' },
		{ id: 25, name: 'item25' }
	];
	let items3 = [
		{ id: 31, name: 'item31' },
		{ id: 32, name: 'item32' },
		{ id: 33, name: 'item33' },
		{ id: 34, name: 'item34' },
		{ id: 35, name: 'item35' },
		{ id: 36, name: 'item36' }
	];
	let items5 = [
		{ id: 51, name: 'item51' },
		{ id: 52, name: 'item52' },
		{ id: 53, name: 'item53' },
		{ id: 54, name: 'item54' },
		{ id: 55, name: 'item55' },
		{ id: 56, name: 'item56' }
	];
	let board = [
		{
			id: 1,
			name: 'TODO',
			items: [
				{ id: 41, name: 'item41' },
				{ id: 42, name: 'item42' },
				{ id: 43, name: 'item43' },
				{ id: 44, name: 'item44' },
				{ id: 45, name: 'item45' },
				{ id: 46, name: 'item46' },
				{ id: 47, name: 'item47' },
				{ id: 48, name: 'item48' },
				{ id: 49, name: 'item49' }
			]
		},
		{
			id: 2,
			name: 'DOING',
			items: []
		},
		{
			id: 3,
			name: 'DONE',
			items: []
		}
	];
</script>

<section>
	<Search />
	<VerticalList items={items1} />
	<br /><br /><br />
	<Grid items={items2} />
	<br /><br /><br />
	<HorizontalList items={items3} />
	<HorizontalList items={items5} />
	<Board columnItems={board} />
</section>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
	section {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
