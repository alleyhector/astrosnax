import { useState, useEffect, useCallback } from 'react'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import { View, Text } from '@/components/Themed'
import { getPublicAccessToken, searchPlaylistsByParams } from '@/API/SpotifyAPI'
import {
  PlaylistItem,
  PlaylistProps,
  SpotifySearchResponse,
} from '@/types/spotify'
import {
  card,
  backgroundColorVar2,
  column,
  apiImage,
  apiTextContainer,
  row,
  apiTitle,
} from '@/constants/Styles'

const Playlists = ({ query }: PlaylistProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAccessToken = useCallback(async () => {
    if (!accessToken) {
      const token = await getPublicAccessToken()
      setAccessToken(token)
      return token
    }
    return accessToken
  }, [accessToken])

  // Fetches playlists based on the provided query and updates the state
  const getPlaylists = useCallback(async () => {
    setLoading(true)
    try {
      const accessToken = await fetchAccessToken()
      const data: SpotifySearchResponse = await searchPlaylistsByParams({
        accessToken,
        query,
      })

      if (data) {
        setPlaylists(data.playlists.items)
      }
    } catch (error) {
      // Log the error to the console for debugging purposes
      console.error('Failed to fetch playlists:', error)
      // Optionally, you could set an error state here to display an error message to the user
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [query, fetchAccessToken])

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      getPlaylists()
    }
  }, [query, getPlaylists])

  return (
    <View style={[column, card, backgroundColorVar2]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {playlists &&
            playlists.map((playlist, index) => (
              <View style={[row, backgroundColorVar2]} key={index}>
                <View>
                  {playlist.images.length > 0 && (
                    <Image
                      source={{ uri: playlist.images[0].url }}
                      style={[apiImage, backgroundColorVar2]}
                    />
                  )}
                </View>
                <View style={[apiTextContainer, backgroundColorVar2]}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(playlist.external_urls.spotify)
                    }
                  >
                    <Text style={apiTitle}>
                      {playlist.name} by {playlist.owner.display_name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(playlist.external_urls.spotify)
                    }
                  >
                    <Text>Open playlist</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </>
      )}
    </View>
  )
}

export default Playlists
