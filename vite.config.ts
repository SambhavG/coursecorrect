import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
	plugins: [sveltekit(), dsv()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
