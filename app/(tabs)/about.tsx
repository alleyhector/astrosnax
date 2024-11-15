import {
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { View, Text } from '@/components/Themed'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import Markdown from 'react-native-markdown-display'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AboutCollectionQueryResponse } from '@/types/contentful'
import { container } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { DefaultTheme } from '@react-navigation/native'
import { useAutoRefetch } from '@/components/useAutoRefetch'

const QUERY_ABOUT = gql`
  {
    aboutCollection {
      items {
        name
        description
        aboutMe
        profile {
          url
        }
      }
    }
  }
`

const AboutScreen = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
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
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        display: 'flex',
        backgroundColor: colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={container}>
        {about && (
          <>
            {about.profile && (
              <Image style={styles.hero} source={{ uri: about.profile.url }} />
            )}
            <Markdown style={styles}>{about.aboutMe}</Markdown>
          </>
        )}
      </View>
    </ScrollView>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
