import axios from 'axios'
import { createExpoFileSystemStorage } from 'redux-persist-expo-file-system-storage'

interface RecipeProps {
  query: string
  cuisineType?: string
}

const appId = process.env.EXPO_PUBLIC_EDAMAM_ID
const appKey = process.env.EXPO_PUBLIC_EDAMAM_KEY

if (!appId || !appKey) {
  throw new Error('EDAMAM_ID or EDAMAM_KEY is not set')
}

// Create an instance of ExpoFileSystemStorage
const expoFileSystemStorage = createExpoFileSystemStorage()

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
    const cachedData = await expoFileSystemStorage.getItem(`edamam-${query}`)
    if (cachedData) {
      console.warn('Using cached recipe data.')
      const parsedCachedData = JSON.parse(cachedData)
      console.log('PARSED CACHED DATA', parsedCachedData.hits[0].recipe.image)
      return JSON.parse(cachedData)
    } else {
      const response = await axios.get(url, { params })
      // Store the fetched data in FileSystemStorage
      const CACHE_KEY = `edamam-${query}`
      await expoFileSystemStorage.setItem(
        CACHE_KEY,
        JSON.stringify(response.data),
      )
      console.log('EDAM API CALLED')
      return response.data
    }
  } catch (error) {
    console.log('REG ERROR')
    console.error('Error fetching recipe data:', error)

    if (axios.isAxiosError(error)) {
      console.log('AXIOS ERROR')
      throw new Error(`Error fetching recipe data: ${error.message}`)
    } else {
      throw new Error('Error fetching recipe data and no cached data available')
    }
  }
}
