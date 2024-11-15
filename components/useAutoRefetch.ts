import { useState, useEffect, useCallback } from 'react'
import { AppState } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

interface UseAutoRefetchOptions {
  refetch: () => Promise<any>
  interval?: number // Optional: Interval for periodic refetch (in ms)
}

export function useAutoRefetch({
  refetch,
  interval = 60 * 60 * 1000, // 60 minutes
}: UseAutoRefetchOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefetchDate, setLastRefetchDate] = useState(
    new Date().toDateString(),
  )

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }, [refetch])

  // App focus effect to refetch data
  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  // Periodic refetch using setInterval
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch()
      setLastRefetchDate(new Date().toDateString())
    }, interval)

    return () => clearInterval(intervalId)
  }, [refetch, interval])

  // Daily auto-refresh based on date change
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = new Date().toDateString()
      if (lastRefetchDate !== currentDate) {
        refetch()
        setLastRefetchDate(currentDate)
      }
    }

    // Check date change on app launch and when the app comes into focus
    checkDateChange()

    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'active') {
          refetch()
        }
      },
    )

    return () => {
      appStateListener.remove()
    }
  }, [lastRefetchDate, refetch])

  return { isRefreshing, onRefresh, lastRefetchDate }
}
