import { PlaylistProps } from '@/types/spotify'

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID
const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET

// Get access token using Client Credentials Flow
export const getPublicAccessToken = async () => {
  console.log('clientId:', clientId)
  console.log('clientSecret:', clientSecret)
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: 'grant_type=client_credentials',
    })
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Failed to get access token:', error)
    throw error
  }
}

// Search for playlists by artist and/or genre
export const searchPlaylistsByParams = async ({
  accessToken,
  query,
  artist,
  genre,
}: PlaylistProps) => {
  console.log('accessToken:', accessToken)
  try {
    const q =
      `${query} ${artist ? `artist:${artist}` : ''} ${genre ? `genre:${genre}` : ''}`.trim()
    console.log('query:', q)
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=playlist`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const data = await response.json()
    return data.playlists.items
  } catch (error) {
    console.error('Failed to search playlists:', error)
    throw error
  }
}
