import { FC, memo, useState, useEffect } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { OperationVariables, useQuery } from '@apollo/client'
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
import Pagination from '@/components/Pagination'
import { QUERY_POSTS } from '@/lib/graphql'

const ArchiveScreen: FC = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const today = new Date().toString()
  const PAGE_SIZE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) // Update this dynamically if total posts are known.

  const { data, loading, error, refetch } = useQuery<
    BlogPostQueryResponse,
    OperationVariables
  >(QUERY_POSTS, {
    fetchPolicy: 'network-only',
    variables: {
      today: new Date(today),
      skip: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    },
  })
  const posts = data?.blogPostCollection?.items || []

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

  // Update total pages dynamically if your API provides the total count.
  useEffect(() => {
    if (data?.blogPostCollection) {
      const totalItems = data.blogPostCollection.total || 1
      setTotalPages(Math.ceil(totalItems / PAGE_SIZE))
    }
  }, [data])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const { onRefresh, isRefreshing } = useAutoRefetch({
    refetch,
  })
  if (loading) return <ActivityIndicator size='large' />
  if (error) return <Text style={{ margin: 60 }}>Error: {error.message}</Text>

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
          removeClippedSubviews
          style={{ backgroundColor: 'transparent' }}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.sys.publishedAt}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
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
})
