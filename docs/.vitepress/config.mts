import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Bacon Dragon',
  description: 'Game systems tools for Unity — StatFlux and the Bacon Dragon toolkit.',
  head: [['link', { rel: 'icon', type: 'image/png', href: '/statflux-mark.png' }]],
  themeConfig: {
    logo: '/statflux-mark.png',
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
