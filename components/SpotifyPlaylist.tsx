import { useState, useEffect, useCallback } from 'react'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
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
import {
  card,
  column,
  apiImage,
  apiTextContainer,
  row,
  apiTitle,
} from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { ExternalLink } from './ExternalLink'

const Playlists = ({ transitQuery, foodQuery }: PlaylistProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackgroundMusic,
  }

  const fetchAccessToken = useCallback(async () => {
    if (!accessToken) {
      const token = await fetchPublicAccessToken()
      setAccessToken(token)
      return token
    }
    return accessToken
  }, [accessToken])

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
        // console.log('SPOTIFY API CALLED ', data.playlists.items)
        return data.playlists.items || []
      } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Failed to fetch playlists:', error)
        return []
      }
    },
    [fetchAccessToken],
  )

  const fetchAndCombinePlaylists = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch data from both queries
      const mainResults = transitQuery
        ? await fetchPlaylists(transitQuery)
        : null
      const foodResults =
        foodQuery && foodQuery.trim() ? await fetchPlaylists(foodQuery) : null

      // Ensure both results are arrays and filter out null values
      const mainResultsArray = Array.isArray(mainResults)
        ? mainResults.filter(Boolean)
        : []
      const foodResultsArray = Array.isArray(foodResults)
        ? foodResults.filter(Boolean)
        : []
      console.log('transitQuery', transitQuery)
      console.log('mainResultsArray', mainResultsArray)
      console.log('foodQuery', foodQuery)
      console.log('foodResultsArray', foodResultsArray)

      // Combine the results and remove duplicates (by playlist id in this example)
      const combinedResults = [
        ...mainResultsArray,
        ...foodResultsArray.filter(
          (item) =>
            !mainResultsArray.some((mainItem) => mainItem.id === item.id),
        ),
      ]

      console.log('combinedResults', combinedResults.length)
      if (combinedResults.length > 0) {
        setPlaylists(combinedResults.slice(0, 2))
      } else {
        console.log('No results from either query')
        setPlaylists([])
      }
    } catch (error) {
      console.error('Error combining playlists:', error)
    } finally {
      setLoading(false)
    }
  }, [foodQuery, transitQuery, fetchPlaylists])

  // Call the API when the query changes
  useEffect(() => {
    if (transitQuery || foodQuery) {
      fetchAndCombinePlaylists()
    }
  }, [transitQuery, foodQuery, fetchPlaylists, fetchAndCombinePlaylists])

  return (
    <View style={[column, card, cardBackground]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {playlists &&
            playlists.map((playlist, index) => (
              <View style={[row, cardBackground]} key={index}>
                <View>
                  {playlist.images.length > 0 && (
                    <Image
                      source={{ uri: playlist.images[0].url }}
                      style={[apiImage, cardBackground]}
                    />
                  )}
                </View>
                <View style={[apiTextContainer, cardBackground]}>
                  <ExternalLink href={playlist.external_urls.spotify}>
                    <View style={cardBackground}>
                      <Text style={apiTitle}>
                        {playlist.name} by {playlist.owner.display_name}
                      </Text>
                      <Text>Open playlist</Text>
                    </View>
                  </ExternalLink>
                </View>
              </View>
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

export default Playlists
