import { FC, memo, useState, useCallback } from 'react'
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
import { LinearGradient } from 'expo-linear-gradient'

const QUERY_POSTS = gql`
  query blogPosts($today: DateTime!, $skip: Int, $limit: Int) {
    blogPostCollection(
      where: { publishDate_lte: $today }
      order: publishDate_DESC
      skip: $skip
      limit: $limit
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
  const PAGE_SIZE = 3

  const { data, loading, error, refetch, fetchMore } = useQuery<
    BlogPostQueryResponse,
    OperationVariables
  >(QUERY_POSTS, {
    fetchPolicy: 'network-only',
    variables: { today: new Date(today), skip: 0, limit: PAGE_SIZE },
  })

  const posts = data?.blogPostCollection?.items || []
  // console.log('posts:', posts)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadMore = async () => {
    if (isLoadingMore) return

    setIsLoadingMore(true)
    try {
      await fetchMore({
        variables: {
          skip: posts.length, // Skip the number of posts already loaded
          limit: PAGE_SIZE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult

          return {
            ...previousResult,
            blogPostCollection: {
              ...previousResult.blogPostCollection,
              items: [
                ...previousResult.blogPostCollection.items,
                ...fetchMoreResult.blogPostCollection.items,
              ],
            },
          }
        },
      })

      console.log('loaded more')
      console.log('Variables:', posts.length, PAGE_SIZE)
    } catch (err) {
      console.error('Error loading more:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const { onRefresh, isRefreshing } = useAutoRefetch({
    refetch,
  })
  if (loading) return <ActivityIndicator size='large' />
  if (error) return <Text style={{ margin: 60 }}>Error: {error.message}</Text>

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
    <LinearGradient
      colors={[
        colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
        colorScheme === 'dark' ? '#000' : '#fac7b0',
      ]}
      start={{ x: 0.5, y: 0.6 }}
    >
      <View
        style={{
          paddingTop: insets.top,
          display: 'flex',
          backgroundColor: 'transparent',
        }}
      >
        <FlatList
          data={posts}
          removeClippedSubviews={true}
          windowSize={5} // Optimize rendering performance
          keyExtractor={(item) => item.sys.publishedAt} // Ensure unique and stable keys
          renderItem={renderItem}
          initialNumToRender={PAGE_SIZE} // Optimize initial rendering
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0, // Retain scroll position
          }}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size='small' /> : null
          }
        />
      </View>
    </LinearGradient>
  )
}

export default ArchiveScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Nimbus',
    padding: 30,
    backgroundColor: 'transparent',
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
