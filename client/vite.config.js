import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://exprendature-tracker.vercel.app/',
  //       changeOrigin: true,
  //     },
  //   },
  // },  
  plugins: [react()],
});

