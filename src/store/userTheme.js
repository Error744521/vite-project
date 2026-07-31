// src/hooks/useTheme.js
import { computed } from 'vue'
import { themeManager } from '@/utils/theme'

export function useTheme() {
  // 当前主题模式
  const themeMode = themeManager.getThemeModeRef()

  // 是否为深色模式
  const isDark = computed(() => themeMode.value === 'dark')

  // 切换主题
  const toggleTheme = () => {
    themeManager.toggleTheme()
  }

  // 设置特定主题
  const setTheme = (mode) => {
    themeManager.setThemeMode(mode)
  }

  // 设置自定义主题色
  const setPrimaryColor = (color) => {
    themeManager.setCustomPrimaryColor(color)
  }

  // 获取当前主题色
  const getPrimaryColor = () => {
    return themeManager.getCustomPrimaryColor()
  }

  return {
    themeMode,
    isDark,
    toggleTheme,
    setTheme,
    setPrimaryColor,
    getPrimaryColor
  }
}
