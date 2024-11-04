import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { ApolloProvider } from '@apollo/client'
import { client as apolloClient } from '@/API/ContentfulAPI'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstableSettings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'Home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { loaded, error } = useCustomFonts()

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

const useCustomFonts = () => {
  const [loaded, error] = useFonts({
    Courier: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nimbus: require('../assets/fonts/Nimbus/NimbusSans-Regular.otf'),
    NimbusBold: require('../assets/fonts/Nimbus/NimbusSans-Bold.otf'),
    NimbusItalic: require('../assets/fonts/Nimbus/NimbusSans-Italic.otf'),
    NimbusBoldItalic: require('../assets/fonts/Nimbus/NimbusSans-BoldItalic.otf'),
    AngelClub: require('../assets/fonts/AngelClub/AngelClub.otf'),
    ...FontAwesome.font,
  })

  return { loaded, error }
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={apolloClient}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme
                ? Colors[colorScheme].background
                : DefaultTheme.colors.background,
            },
            headerTintColor: colorScheme
              ? Colors[colorScheme].tint
              : DefaultTheme.colors.text,
          }}
        >
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false, title: 'Back' }}
          />
          <Stack.Screen name='[slug]' options={{ title: 'Post Details' }} />
        </Stack>
      </ApolloProvider>
    </ThemeProvider>
  )
}
