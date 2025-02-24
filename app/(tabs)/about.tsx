import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Image } from 'expo-image'
import { View, Text } from '@/components/Themed'
import { OperationVariables, useQuery } from '@apollo/client'
import Markdown from '@ronradtke/react-native-markdown-display'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AboutCollectionQueryResponse } from '@/types/contentful'
import { container, dimensions } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { DefaultTheme } from '@react-navigation/native'
import { useAutoRefetch } from '@/components/useAutoRefetch'
import { useMarkdownStyles } from '@/components/useMarkdown'
import Attribution from '@/components/Attribution'
import { LinearGradient } from 'expo-linear-gradient'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { QUERY_ABOUT } from '@/lib/graphql'

const AboutScreen = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const markdownStyles = useMarkdownStyles()
  const bottomTabBarHeight = useBottomTabBarHeight()

  const { data, loading, error, refetch } = useQuery<
    AboutCollectionQueryResponse,
    OperationVariables
  >(QUERY_ABOUT, {
    fetchPolicy: 'network-only',
  })
  const { onRefresh, isRefreshing } = useAutoRefetch({
    refetch,
  })
  if (loading) return <ActivityIndicator size='large' />
  if (error) return <Text>Error: {error.message}</Text>
  const about = data?.aboutCollection?.items[0]

  return (
    <LinearGradient
      colors={[
        colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
        colorScheme === 'dark' ? '#000' : '#fac7b0',
      ]}
      start={{ x: 0.5, y: 0.6 }}
      style={{
        height: dimensions.fullHeight - bottomTabBarHeight,
      }}
    >
      <ScrollView
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          display: 'flex',
          overflow: 'scroll',
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={container}>
          {about && (
            <>
              {about.profile && (
                <Image
                  style={styles.hero}
                  source={{ uri: about.profile.url }}
                  alt='Rotoscope drawing of the author'
                />
              )}
              <Markdown style={markdownStyles}>{about.aboutMe}</Markdown>
            </>
          )}
          <Attribution />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  hero: {
    marginTop: 20,
    width: 260,
    height: 387,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
