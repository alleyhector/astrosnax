import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface SearchMealParams {
  fallbackFood?: string | string[]
}

export const searchRecipe = async ({ fallbackFood }: SearchMealParams) => {
  const url = 'https://www.themealdb.com/api/json/v1/1/search.php'
  const params = {
    s: fallbackFood, // Search query (e.g., "chicken")
  }

  try {
    // Attempt to retrieve cached data
    const cachedData = await AsyncStorage.getItem(`mealdb-${fallbackFood}`)
    if (cachedData) {
      console.warn('Using cached meal recipe data.')

      return JSON.parse(cachedData)
    } else {
      const response = await axios.get(url, { params })
      // Store the fetched data in AsyncStorage
      const CACHE_KEY = `mealdb-${fallbackFood}`
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
      console.log('MEAL API CALLED')
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
