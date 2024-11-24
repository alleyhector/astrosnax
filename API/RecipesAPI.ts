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
    const response = await axios.get(url, { params })
    const CACHE_KEY = `edamam-${query}`
    // Store the fetched data in AsyncStorage
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
    console.log('ASYNC CACHE KEY: ', AsyncStorage.getItem(CACHE_KEY))
    return response.data
  } catch (error) {
    console.error('Error fetching recipe data:', error)

    // Attempt to retrieve cached data
    const cachedData = await AsyncStorage.getItem(`edamam-${query}`)
    console.log('CACHED DATA: ', cachedData)
    if (cachedData) {
      console.warn('Falling back to cached recipe data.')

      return JSON.parse(cachedData)
    }

    // If no cached data is available, throw the error
    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching recipe data: ${error.message}`)
    } else {
      throw new Error('Error fetching recipe data and no cached data available')
    }
  }
}
