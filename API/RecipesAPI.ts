import { RecipeProps } from '@/types/edamam'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const appId = process.env.EXPO_PUBLIC_EDAMAM_ID
if (!appId) {
  throw new Error('EDAMAM_ID is not set')
}

const appKey = process.env.EXPO_PUBLIC_EDAMAM_KEY
if (!appKey) {
  throw new Error('EDAMAM_KEY is not set')
}

export const searchRecipe = async ({ query, cuisineType }: RecipeProps) => {
  const url = 'https://api.edamam.com/api/recipes/v2'
  const params = {
    type: 'public', // Required parameter
    q: query, // Search query (e.g., "chicken")
    app_id: appId,
    app_key: appKey,
    cuisineType: cuisineType, // Optional parameter (e.g., "Italian")
  }

  try {
    // Attempt to retrieve cached data
    const cachedData = await AsyncStorage.getItem(`edamam-${query}`)
    if (cachedData) {
      console.warn('Using cached recipe data.')

      return JSON.parse(cachedData)
    } else {
      const response = await axios.get(url, { params })
      // Store the fetched data in AsyncStorage
      const CACHE_KEY = `edamam-${query}`
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data))

      return response.data
    }
  } catch (error) {
    console.error('Error fetching recipe data:', error)

    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching recipe data: ${error.message}`)
    } else {
      throw new Error('Error fetching recipe data and no cached data available')
    }
  }
}
