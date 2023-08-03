import { GlobalTheme, darkTheme, lightTheme, useOsTheme } from "naive-ui";
import { Ref, ref } from "vue"

type Theme = Ref<GlobalTheme | null>
type UseToggleTheme = () => {
  theme: Theme
  toggleTheme: () => void
  currentTheme: 'dark' | 'light'
  currentThemeBool: Ref<boolean>
}

function convert(theme: any) {
  return theme == 'dark' ? darkTheme : lightTheme
}

export const useToggleTheme: UseToggleTheme = () => {
  const themeRef = useOsTheme()
  const currentTheme = ref<any>(themeRef.value)
  const currentThemeBool = ref(currentTheme.value == 'dark')
  const theme = ref(convert(currentTheme.value))

  return {
    theme,
    currentTheme,
    currentThemeBool,
    toggleTheme() {
      currentTheme.value = currentTheme.value == 'dark' ? 'light' : 'dark'
      currentThemeBool.value = currentTheme.value == 'dark'
      
      theme.value = convert(currentTheme.value)
      
    }
  }
}