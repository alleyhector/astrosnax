import React from 'react'
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { Image } from 'expo-image'
import { container, textShadow } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { DefaultTheme } from '@react-navigation/native'
import { Text, View } from '@/components/Themed'
import Today from '@/components/Today'
import { useQuery, OperationVariables } from '@apollo/client'
import { BlogPostQueryResponse } from '@/types/contentful'
import { useAutoRefetch } from '@/components/useAutoRefetch'
import { LinearGradient } from 'expo-linear-gradient'
import { QUERY_TODAY_POST } from '@/lib/graphql'

const HomeScreen = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const today = new Date().toString()

  const { data, refetch, loading, error } = useQuery<
    BlogPostQueryResponse,
    OperationVariables
  >(QUERY_TODAY_POST, {
    fetchPolicy: 'network-only',
    variables: { today: new Date(today) },
  })

  const { onRefresh, isRefreshing } = useAutoRefetch({ refetch })
  if (loading) return <ActivityIndicator size='large' />
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <LinearGradient
      colors={[
        colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
        colorScheme === 'dark' ? '#000' : '#fac7b0',
      ]}
      start={{ x: 0.5, y: 0.6 }}
    >
      <ScrollView
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          display: 'flex',
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={container}>
          <Text style={styles.title}>AstroSnax</Text>
          <Text style={styles.subtitle}>Food for celestial thought</Text>
          <Text style={styles.p}>
            What's the astrological weather report for today? Below you will
            find a list of today's transits. Interpret them how you will. I have
            done so by providing recipes created with the mashup of these
            cosmological characters and dishes that express how their powers
            combine...for better or worse...
          </Text>
          <Text style={styles.p}>
            Oh and why not have some music with dinner? Spotify will provide
            playlists based on either the transits or the recipes. Enjoy!
          </Text>
          <Image
            style={styles.logo}
            source={require('@/assets/images/logo.png')}
            alt='AstroSnax logo'
          />
          <Today data={data} />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'AngelClub',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    ...textShadow,
  },
  subtitle: {
    fontFamily: 'AngelClub',
    fontSize: 22,
    margin: 10,
    textAlign: 'center',
    ...textShadow,
  },
  p: {
    fontFamily: 'Nimbus',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
  },
  logo: {
    width: 300,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
})

export default HomeScreen
