import axios from 'axios'
import { createExpoFileSystemStorage } from 'redux-persist-expo-file-system-storage'

interface SearchMealParams {
  fallbackFood?: string | string[]
}

// Create an instance of ExpoFileSystemStorage
const expoFileSystemStorage = createExpoFileSystemStorage()

export const searchRecipe = async ({ fallbackFood }: SearchMealParams) => {
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php'
  const params = {
    s: fallbackFood, // Search query (e.g., "chicken")
  }

  try {
    // Attempt to retrieve cached data
    const cachedData = await expoFileSystemStorage.getItem(
      `mealdb-${fallbackFood}`,
    )
    if (cachedData) {
      console.warn('Using cached meal recipe data.')

      return JSON.parse(cachedData)
    } else {
      const response = await axios.get(url, { params })
      // Store the fetched data in AsyncStorage
      const CACHE_KEY = `mealdb-${fallbackFood}`
      await expoFileSystemStorage.setItem(
        CACHE_KEY,
        JSON.stringify(response.data),
      )
      console.log(`MEAL API CALLED for ${fallbackFood}`)
      return response.data
    }
  } catch (error) {
    console.error('Error fetching mealdb recipe data:', error)

    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching mealdb recipe data: ${error.message}`)
    } else {
      throw new Error(
        'Error fetching mealdb recipe data and no cached data available',
      )
    }
  }
}
