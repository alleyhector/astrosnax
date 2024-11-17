/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native'
// import {
//   Markdown as DefaultMarkdown,
//   MarkdownProps,
// } from 'react-native-markdown-display'
import { StyleSheet } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from './useColorScheme'
import { MarkdownStyles } from '@/types/contentful'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']
export type ExtendedMarkdownProps = ThemeProps & MarkdownStyles

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return Colors[theme][colorName]
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  )

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}

// export function Markdown(props: ExtendedMarkdownProps) {
//   const { style, lightColor, darkColor, ...otherProps } = props
//   const backgroundColor = useThemeColor(
//     { light: lightColor, dark: darkColor },
//     'background',
//   )

//   return (
//     <DefaultMarkdown style={[{ backgroundColor }, style]} {...otherProps} />
//   )
// }

export function CreateMarkdownStyles() {
  // const textColor = useThemeColor({}, 'text')
  // const linkColor = useThemeColor({}, 'tint')
  // const backgroundColor = useThemeColor({}, 'background')
  // const headingColor = useThemeColor({}, 'cardBackgroundVar1')

  const colorScheme = useColorScheme()
  const textColor = Colors[colorScheme ?? 'light'].text

  return StyleSheet.create({
    h1: { fontFamily: 'AngelClub', fontSize: 24, color: textColor },
    h2: { fontFamily: 'AngelClub', fontSize: 22, color: textColor },
    h3: { fontFamily: 'AngelClub', fontSize: 20, color: textColor },
    strong: { fontFamily: 'AngelClub', fontSize: 18, color: textColor },
    paragraph: { fontFamily: 'Nimbus', fontsize: 16, color: textColor },
  })
}
