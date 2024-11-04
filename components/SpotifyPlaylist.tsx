import { useState, useEffect, useCallback } from 'react'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import { View, Text } from '@/components/Themed'
import { getPublicAccessToken, searchPlaylistsByParams } from '@/API/SpotifyAPI'
import { PlaylistItem, PlaylistProps } from '@/types/spotify'
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
  const [accessToken, setAccessToken] = useState(null)
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAccessToken = useCallback(async () => {
    if (!accessToken) {
      const token = await getPublicAccessToken()
      setAccessToken(token)
      return token
    }
    return accessToken
  }, [accessToken])

  const getPlaylists = useCallback(async () => {
    setLoading(true)
    try {
      const accessToken = await fetchAccessToken()
      const data = await searchPlaylistsByParams({
        accessToken,
        query,
      })

      if (data) {
        setPlaylists(data.playlists.items)
      }
    } catch (error) {
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
        <ActivityIndicator
          size='large'
          color='#1DB954'
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          {playlists &&
            playlists.map((playlist, index) => (
              <View style={[row, backgroundColorVar2]} key={index}>
                <View>
                  <Image
                    source={{ uri: playlist.images[0].url }}
                    style={[apiImage, backgroundColorVar2]}
                  />
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
