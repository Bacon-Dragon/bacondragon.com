import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HeroDragon from './HeroDragon.vue'
// Self-hosted brand fonts (no third-party requests): Saira with width + italic axes, Fira Code.
import '@fontsource-variable/saira/wdth.css'
import '@fontsource-variable/saira/wdth-italic.css'
import '@fontsource-variable/fira-code/wght.css'
import './brand.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroDragon)
    })
  }
} satisfies Theme
