import axios from 'axios'
import FileSystemStorage from 'redux-persist-expo-filesystem'

interface RecipeProps {
  query: string
  cuisineType?: string
}

const appId = process.env.EXPO_PUBLIC_EDAMAM_ID
const appKey = process.env.EXPO_PUBLIC_EDAMAM_KEY

if (!appId || !appKey) {
  throw new Error('EDAMAM_ID or EDAMAM_KEY is not set')
}

export const searchRecipe = async ({ query, cuisineType }: RecipeProps) => {
  const url = 'https://api.edamam.com/api/recipes/v2'
  const params = {
    type: 'public', // Required parameter
    q: query, // Search query (e.g., "chicken")
    app_id: appId!,
    app_key: appKey!,
    cuisineType: cuisineType, // Optional parameter (e.g., "Italian")
  }

  try {
    // Attempt to retrieve cached data
    const cachedData = await FileSystemStorage.getItem(
      `edamam-${query}-${cuisineType}`,
    )
    if (cachedData) {
      console.warn('Using cached recipe data.')
      return JSON.parse(cachedData)
    } else {
      const response = await axios.get(url, { params })
      // Store the fetched data in FileSystemStorage
      const CACHE_KEY = `edamam-${query}-${cuisineType}`
      await FileSystemStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
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
