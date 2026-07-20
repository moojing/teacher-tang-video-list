import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop()
const isUserSite = repositoryName?.endsWith('.github.io')
const githubPagesBase = process.env.GITHUB_ACTIONS && repositoryName && !isUserSite
  ? `/${repositoryName}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base: githubPagesBase,
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    setupFiles: './src/test/setup.js',
  },
})
