import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import {
  getPublicAccessToken,
  searchPlaylistsByParams,
} from '../API/SpotifyAPI'

const SpotifyPlaylist = () => {
  const [accessToken, setAccessToken] = useState(null)
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [playlists, setPlaylists] = useState<
    {
      id: string
      name: string
      images: { url: string }[]
      external_urls: { spotify: string }
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  const fetchPlaylists = async () => {
    setLoading(true)
    if (!accessToken) {
      const token = await getPublicAccessToken()
      setAccessToken(token)
    }
    try {
      const results = await searchPlaylistsByParams(accessToken, artist, genre)
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
          keyExtractor={(item) => item.id}
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

export default SpotifyPlaylist
