import { PlaylistFetchProps } from '@/types/spotify'
import axios from 'axios'
import { Buffer } from 'buffer'

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID
if (!clientId) {
  throw new Error('SPOTIFY_CLIENT_ID is not set')
}
const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET
if (!clientSecret) {
  throw new Error('SPOTIFY_CLIENT_SECRET is not set')
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://accounts.spotify.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// Get access token using Client Credentials Flow
export const fetchPublicAccessToken = async () => {
  try {
    const response = await axiosInstance.post(
      '/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
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
}: PlaylistFetchProps) => {
  const url = 'https://api.spotify.com/v1/search'
  const headers = { Authorization: `Bearer ${accessToken}` }
  const params = {
    q: query,
    type: 'playlist',
    limit: 1,
  }
  try {
    const response = await axios.get(url, {
      headers,
      params,
    })
    return response.data
  } catch (error) {
    console.error('Failed to search playlists:', error)
    throw error
  }
}
