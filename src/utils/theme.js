// src/utils/theme.js
import { ref } from 'vue'

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

  // 计算 Element Plus 主色衍生变量，比例保持与默认主题一致。
  calculateDerivedColors(primaryColor) {
    const root = document.documentElement

    root.style.setProperty('--el-color-primary-light-3', this.mix(primaryColor, '#ffffff', 30))
    root.style.setProperty('--el-color-primary-light-5', this.mix(primaryColor, '#ffffff', 50))
    root.style.setProperty('--el-color-primary-light-7', this.mix(primaryColor, '#ffffff', 70))
    root.style.setProperty('--el-color-primary-light-8', this.mix(primaryColor, '#ffffff', 80))
    root.style.setProperty('--el-color-primary-light-9', this.mix(primaryColor, '#ffffff', 90))
    root.style.setProperty('--el-color-primary-dark-2', this.mix(primaryColor, '#000000', 20))
  }

  mix(color, targetColor, percent) {
    const colorRgb = this.hexToRgb(color)
    const targetRgb = this.hexToRgb(targetColor)
    const weight = percent / 100
    const result = colorRgb.map((value, index) => {
      return Math.round(value * (1 - weight) + targetRgb[index] * weight)
    })
    return this.rgbToHex(result)
  }

  hexToRgb(color) {
    const hex = color.replace('#', '')
    const normalizedHex = hex.length === 3
      ? hex.split('').map((item) => item + item).join('')
      : hex
    const num = parseInt(normalizedHex, 16)
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
  }

  rgbToHex(rgb) {
    return `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`
  }
}

export const themeManager = new ThemeManager()
