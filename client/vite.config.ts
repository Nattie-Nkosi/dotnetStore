import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [react(), mkcert()],
	build: {
		outDir: 'dist',
		sourcemap: false,
		minify: 'terser',
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					redux: ['@reduxjs/toolkit', 'react-redux'],
					mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
					stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
})
