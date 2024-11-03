import { useState, useEffect, useCallback } from 'react'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { View, Text } from '@/components/Themed'
import { getPublicAccessToken, searchPlaylistsByParams } from '@/API/SpotifyAPI'
import { PlaylistItem, PlaylistProps } from '@/types/spotify'

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
    <View style={{ padding: 20 }}>
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
              <View style={styles.flex} key={index}>
                <View>
                  <Image
                    source={{ uri: playlist.images[0].url }}
                    style={styles.recipeImage}
                  />
                </View>
                <View style={styles.recipeTextContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(playlist.external_urls.spotify)
                    }
                  >
                    <Text style={styles.recipeTitle}>
                      {playlist.name} by {playlist.owner.display_name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(playlist.external_urls.spotify)
                    }
                  >
                    <Text>View Recipe</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2ead8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#f2ead8',
  },

  recipeImageContainer: {
    flex: 1,
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2ead8',
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    textAlign: 'center',
  },
  recipeTitle: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 16,
    textAlign: 'left',
  },
})
