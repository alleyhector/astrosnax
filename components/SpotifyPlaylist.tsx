import { useState, useEffect, useCallback, memo, useRef } from 'react'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { View, Text } from '@/components/Themed'
import {
  fetchPublicAccessToken,
  searchPlaylistsByParams,
} from '@/API/SpotifyAPI'
import {
  PlaylistItem,
  PlaylistProps,
  SpotifySearchResponse,
} from '@/types/spotify'
import { card, column, apiTitle } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import Card from './ui/Card'

const Playlists = ({ transitQuery, foodQuery }: PlaylistProps) => {
  const accessTokenRef = useRef<string | null>(null)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackgroundMusic,
  }

  const fetchAccessToken = useCallback(async () => {
    if (!accessTokenRef.current) {
      try {
        const token = await fetchPublicAccessToken()
        accessTokenRef.current = token
        return token
      } catch (error) {
        console.error('Failed to fetch access token:', error)
        return null
      }
    }
    return accessTokenRef.current
  }, [])

  // Fetches playlists based on the provided query and updates the state
  const fetchPlaylists = useCallback(
    async (query: string) => {
      setLoading(true)
      try {
        const accessToken = await fetchAccessToken()
        const data: SpotifySearchResponse = await searchPlaylistsByParams({
          accessToken,
          query,
        })
        return data.playlists.items || []
      } catch (error) {
        console.error(`Failed to fetch playlists for query "${query}":`, error)
        return []
      }
    },
    [fetchAccessToken],
  )

  const fetchAndCombinePlaylists = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch data from both queries concurrently
      const [mainResults, foodResults] = await Promise.all([
        transitQuery
          ? fetchPlaylists(`"${transitQuery}"`)
          : Promise.resolve(null),
        foodQuery && foodQuery.trim()
          ? fetchPlaylists(foodQuery)
          : Promise.resolve(null),
      ])

      // Ensure both results are arrays and filter out null values
      const mainResultsArray = Array.isArray(mainResults)
        ? mainResults.filter(Boolean)
        : []

      const foodResultsArray = Array.isArray(foodResults)
        ? foodResults.filter(Boolean)
        : []

      const mainResultSliced = mainResultsArray.slice(0, 1)
      const foodResultSliced = foodResultsArray.slice(0, 1)

      // Combine the results and remove duplicates (by playlist id in this example)
      const combinedResults = [
        ...mainResultSliced,
        ...foodResultSliced.filter(
          (item) =>
            !mainResultsArray.some((mainItem) => mainItem.id === item.id),
        ),
      ]

      const finalResults =
        combinedResults.length > 1
          ? combinedResults
          : mainResultsArray.length > 1
            ? mainResultsArray.slice(0, 2)
            : foodResultsArray.length > 1
              ? foodResultsArray.slice(0, 2)
              : []

      if (finalResults.length > 0) {
        setPlaylists(finalResults)
      } else {
        console.log('No playlists found for either of the provided queries.')
      }
    } catch (error) {
      console.error('Error combining playlists:', error)
    } finally {
      setLoading(false)
    }
  }, [foodQuery, transitQuery, fetchPlaylists])

  // Fetch playlists when transitQuery or foodQuery changes.
  useEffect(() => {
    if (transitQuery || foodQuery) {
      fetchAndCombinePlaylists()
    }
  }, [transitQuery, foodQuery, fetchAndCombinePlaylists])

  return (
    <View style={[column, card, cardBackground]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {playlists &&
            playlists.map((playlist) => (
              <Card
                key={playlist.id}
                background={cardBackground}
                imageUrl={playlist.images[0]?.url}
                alt={`Image for ${playlist.name} playlist`}
                title={`${playlist.name} by ${playlist.owner.display_name}`}
                description='Open playlist'
                link={playlist.external_urls.spotify}
              />
            ))}
        </>
      )}
      {playlists.length === 0 && (
        // Last-resort fallback text
        <Text style={apiTitle}>
          Damn this transit is so weird, there are no playlists for it!
        </Text>
      )}
    </View>
  )
}

export default memo(Playlists)
