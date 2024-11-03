import { ExtendedPlaylistProps } from '@/types/spotify'
import axios from 'axios'

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID
const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://accounts.spotify.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// Get access token using Client Credentials Flow
export const getPublicAccessToken = async () => {
  try {
    const response = await axiosInstance.post(
      '/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
      },
    )
    return response.data.access_token
  } catch (error) {
    console.error('Failed to get access token:', error)
    throw error
  }
}

// Search for playlists by artist and/or genre
export const searchPlaylistsByParams = async ({
  accessToken,
  query,
}: ExtendedPlaylistProps) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: 'playlist',
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to search playlists:', error)
    throw error
  }
}
