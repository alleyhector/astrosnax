import { FC, memo, useState, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { useQuery } from '@apollo/client'
import Transits from '@/components/Transits'
import { View, Text } from '@/components/Themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TransitDayGroup, TransitQueryResponse } from '@/types/contentful'
import Colors from '@/constants/Colors'
import { useAutoRefetch } from '@/components/useAutoRefetch'
import { DefaultTheme } from 'expo-router/react-navigation'
import { useColorScheme } from '@/components/useColorScheme'
import { LinearGradient } from 'expo-linear-gradient'
import Pagination from '@/components/Pagination'
import { QUERY_LIVE_TRANSITS } from '@/lib/graphql'
import { getArchiveDayGroups } from '@/lib/transitTimes'

const PAGE_SIZE = 3

const ArchiveScreen: FC = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const [currentPage, setCurrentPage] = useState(1)
  const { from, to } = useMemo(() => {
    const now = Date.now()
    return {
      from: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }, [])

  const { data, loading, error, refetch } = useQuery<TransitQueryResponse>(
    QUERY_LIVE_TRANSITS,
    {
      fetchPolicy: 'network-only',
      variables: { from, to },
    },
  )

  const dayGroups = useMemo(
    () => getArchiveDayGroups(data?.transitCollection?.items ?? []),
    [data?.transitCollection?.items],
  )

  const totalPages = useMemo(() => {
    if (dayGroups.length === 0) return 1
    return Math.ceil(dayGroups.length / PAGE_SIZE)
  }, [dayGroups.length])

  const pageGroups = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return dayGroups.slice(start, start + PAGE_SIZE)
  }, [dayGroups, currentPage])

  const Item: FC<{ item: TransitDayGroup }> = memo(({ item }) => (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}
      >
        {item.dayLabel}
      </Text>
      <Transits transits={item.transits} />
    </View>
  ))
  Item.displayName = 'TransitDayItem'

  const renderItem: ListRenderItem<TransitDayGroup> = ({ item }) => (
    <Item item={item} />
  )

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
          data={pageGroups}
          renderItem={renderItem}
          keyExtractor={(item) => item.dayKey}
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
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontFamily: 'AngelClub',
  },
})
