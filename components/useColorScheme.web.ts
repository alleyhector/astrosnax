import type { AppColorScheme } from './useColorScheme'

// NOTE: The default React Native styling doesn't support server rendering.
export function useColorScheme(): AppColorScheme {
  return 'light'
}
