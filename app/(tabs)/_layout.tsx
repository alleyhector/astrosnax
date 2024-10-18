import { ComponentProps } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: ComponentProps<typeof MaterialCommunityIcons>['name']
  color: string
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  )
}

const TabLayout = () => {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='zodiac-taurus' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='archive'
        options={{
          title: 'Archive',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='zodiac-virgo' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='about'
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='zodiac-cancer' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
