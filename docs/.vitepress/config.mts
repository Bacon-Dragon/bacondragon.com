import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Bacon Dragon',
  description: 'Game systems tools for Unity — StatFlux and the Bacon Dragon toolkit.',
  // Brand Guidelines v1.0 is dark-only: Charcoal Smoke background everywhere.
  appearance: 'force-dark',
  markdown: {
    theme: { light: 'github-light', dark: 'ayu-dark' }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#12161A' }],
    ['meta', { property: 'og:image', content: 'https://bacondragon.com/brand/icon-512.png' }],
    // Lets the hero dragon wait for its pixel assembly instead of flashing in first.
    [
      'script',
      {},
      "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('bd-motion')}catch(e){}"
    ]
  ],
  themeConfig: {
    logo: { src: '/brand/bacon-dragon-mark-128.png', alt: '' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'StatFlux', link: '/statflux/' },
      { text: 'Changelog', link: '/statflux/changelog' }
    ],
    sidebar: {
      '/statflux/': [
        {
          text: 'StatFlux',
          items: [
            { text: 'Overview', link: '/statflux/' },
            { text: 'Getting Started', link: '/statflux/getting-started' },
            { text: 'Core Concepts', link: '/statflux/concepts' },
            { text: 'API Reference', link: '/statflux/api' },
            { text: 'Changelog', link: '/statflux/changelog' }
          ]
        }
      ]
    },
    search: { provider: 'local' },
    footer: {
      message: 'Made by Bacon Dragon LLC',
      copyright: '© 2026 Bacon Dragon LLC'
    }
  }
})
