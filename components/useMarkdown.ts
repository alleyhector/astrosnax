import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export function useMarkdownStyles() {
  const colorScheme = useColorScheme()
  const textColor = Colors[colorScheme ?? 'light'].text

  return StyleSheet.create({
    h1: { fontFamily: 'AngelClub', fontSize: 24, color: textColor },
    h2: { fontFamily: 'AngelClub', fontSize: 22, color: textColor },
    h3: { fontFamily: 'AngelClub', fontSize: 20, color: textColor },
    strong: { fontFamily: 'AngelClub', fontSize: 18, color: textColor },
    paragraph: { fontFamily: 'Nimbus', fontSize: 16, color: textColor },
  })
}
