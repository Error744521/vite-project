// src/utils/theme.js
import { ref, watch } from 'vue'

// 预设主题配置
const presetThemes = {
  light: {
    primaryColor: '#409eff',
    name: 'light'
  },
  dark: {
    primaryColor: '#409eff',
    name: 'dark'
  }
}

class ThemeManager {
  constructor() {
    if (!ThemeManager.instance) {
      this.themeMode = ref('light')
      this.customPrimaryColor = ref('#409eff')

      // 从本地存储恢复主题设置
      const savedTheme = localStorage.getItem('theme-mode')
      const savedColor = localStorage.getItem('theme-primary-color')

      if (savedTheme) {
        this.themeMode.value = savedTheme
      }
      if (savedColor) {
        this.customPrimaryColor.value = savedColor
      }

      // 初始化时应用主题
      this.applyTheme()

      ThemeManager.instance = this
    }

    return ThemeManager.instance
  }

  // 获取当前主题模式
  getThemeMode() {
    return this.themeMode.value
  }

  // 获取当前主题模式（响应式）
  getThemeModeRef() {
    return this.themeMode
  }

  // 获取自定义主题色
  getCustomPrimaryColor() {
    return this.customPrimaryColor.value
  }

  // 切换主题模式
  toggleTheme() {
    this.themeMode.value = this.themeMode.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme-mode', this.themeMode.value)
  }

  // 设置特定主题模式
  setThemeMode(mode) {
    this.themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
  }

  // 设置自定义主题色
  setCustomPrimaryColor(color) {
    this.customPrimaryColor.value = color
    localStorage.setItem('theme-primary-color', color)
  }

  // 应用主题到 DOM
  applyTheme() {
    const root = document.documentElement
    const body = document.body

    // 移除旧主题类
    body.classList.remove('theme-light', 'theme-dark')

    // 添加新主题类
    body.classList.add(`theme-${this.themeMode.value}`)

    // 应用自定义主题色到 CSS 变量
    root.style.setProperty('--el-color-primary', this.customPrimaryColor.value)

    // 根据主题色计算并设置衍生颜色
    this.calculateDerivedColors(this.customPrimaryColor.value)
  }

  // 计算衍生颜色（简化版，实际项目中可使用色彩库）
  calculateDerivedColors(primaryColor) {
    const root = document.documentElement

    // 这里需要将十六进制颜色转换为 HSL，然后计算衍生颜色
    // 简化实现：直接设置一些常用的衍生颜色变量
    root.style.setProperty('--el-color-primary-light-3', this.lighten(primaryColor, 20))
    root.style.setProperty('--el-color-primary-light-5', this.lighten(primaryColor, 40))
    root.style.setProperty('--el-color-primary-light-7', this.lighten(primaryColor, 60))
    root.style.setProperty('--el-color-primary-light-8', this.lighten(primaryColor, 70))
    root.style.setProperty('--el-color-primary-light-9', this.lighten(primaryColor, 80))
    root.style.setProperty('--el-color-primary-dark-2', this.darken(primaryColor, 10))
  }

  // 颜色变亮
  lighten(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
    const B = Math.min(255, (num & 0x0000ff) + amt)
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
  }

  // 颜色变暗
  darken(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, (num >> 16) - amt)
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
    const B = Math.max(0, (num & 0x0000ff) - amt)
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
  }
}

export const themeManager = new ThemeManager()
