import { FC, memo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import { Link } from 'expo-router'
import Transits from '@/components/Transits'
import { View, Text } from '@/components/Themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlogPost, BlogPostQueryResponse } from '@/types/contentful'
import Colors from '@/constants/Colors'
import { useAutoRefetch } from '@/components/useAutoRefetch'
import { DefaultTheme } from '@react-navigation/native'
import { useColorScheme } from '@/components/useColorScheme'

const QUERY_POSTS = gql`
  query blogPosts($today: DateTime!) {
    blogPostCollection(
      where: { sys: { publishedAt_lte: $today } }
      order: sys_publishedAt_DESC
    ) {
      items {
        sys {
          publishedAt
        }
        title
        slug
        author {
          name
        }
        publishDate
        description
        body
        heroImage {
          url
        }
        transitCollection {
          items {
            title
            planet
            sign
            aspect
            transitingPlanet
            transitingSign
            foods
          }
        }
      }
    }
  }
`

const ArchiveScreen: FC = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const today = new Date().toString()

  const { data, loading, error, refetch } = useQuery<
    BlogPostQueryResponse,
    OperationVariables
  >(QUERY_POSTS, {
    fetchPolicy: 'network-only',
    variables: { today: new Date(today) },
  })
  const { onRefresh, isRefreshing } = useAutoRefetch({
    refetch,
  })
  if (loading) return <ActivityIndicator size='large' />
  if (error) return <Text>Error: {error.message}</Text>
  const posts = data?.blogPostCollection.items

  const keyExtractor = (_: BlogPost, index: number) => index.toString()
  const Item: FC<{ item: BlogPost }> = memo(({ item }) => (
    <View style={styles.container}>
      <Link
        href={`/${item.slug}`}
        style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}
      >
        {item.title}
      </Link>
      <Transits transits={item.transitCollection.items} />
    </View>
  ))
  Item.displayName = 'BlogPostItem'

  const renderItem: ListRenderItem<BlogPost> = ({ item }) => (
    <Item item={item} />
  )

  return (
    <View
      style={{
        paddingTop: insets.top,
        display: 'flex',
        backgroundColor: colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
      }}
    >
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}

export default ArchiveScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Nimbus',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: 'AngelClub',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
