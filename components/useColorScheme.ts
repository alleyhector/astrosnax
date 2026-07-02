import { useColorScheme as useRNColorScheme } from 'react-native'

export type AppColorScheme = 'light' | 'dark'

export function useColorScheme(): AppColorScheme {
  const scheme = useRNColorScheme()
  return scheme === 'dark' ? 'dark' : 'light'
}
