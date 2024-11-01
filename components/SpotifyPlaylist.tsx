import { useState } from 'react'
import {
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import { View, Text } from '@/components/Themed'
import { getPublicAccessToken, searchPlaylistsByParams } from '@/API/SpotifyAPI'
import { PlaylistItem } from '@/types/spotify'

const PlaylistSearchByParams = () => {
  const [accessToken, setAccessToken] = useState(null)
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [query, setQuery] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAccessToken = async () => {
    if (!accessToken) {
      const token = await getPublicAccessToken()
      setAccessToken(token)
      return token
    }
    return accessToken
  }

  const fetchPlaylists = async () => {
    setLoading(true)

    try {
      const accessToken = await fetchAccessToken()
      const results = await searchPlaylistsByParams({
        accessToken,
        query,
        artist,
        genre,
      })
      setPlaylists(results)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder='Enter search term'
        value={query}
        onChangeText={setQuery}
        style={{ padding: 8, borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder='Enter artist name'
        value={artist}
        onChangeText={setArtist}
        style={{ padding: 8, borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder='Enter genre'
        value={genre}
        onChangeText={setGenre}
        style={{ padding: 8, borderWidth: 1, marginBottom: 10 }}
      />
      <Button title='Search Playlists' onPress={fetchPlaylists} />

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#1DB954'
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item: PlaylistItem) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.external_urls.spotify)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 5,
                }}
              >
                {item.images[0] && (
                  <Image
                    source={{ uri: item.images[0].url }}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                )}
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

export default PlaylistSearchByParams
