import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,css}'],
  // MUI already handles the browser reset; disabling Tailwind's preflight
  // avoids double resets that fight MUI defaults.
  corePlugins: { preflight: false },
  important: '#__next',
  theme: { extend: {} },
  plugins: [],
}

export default config
