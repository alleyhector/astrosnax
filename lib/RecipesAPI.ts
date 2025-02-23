import axios from 'axios'
import { createExpoFileSystemStorage } from 'redux-persist-expo-file-system-storage'
import * as FileSystem from 'expo-file-system'

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
const expoFileSystemStorage = createExpoFileSystemStorage({
  storagePath: `${FileSystem.documentDirectory}reduxPersist/`,
})

const getCacheAge = async (key: string): Promise<number | null> => {
  try {
    const sanitizedKey = key.replace(/[,\s]+/g, '') // Sanitize the key
    const fileUri = `${FileSystem.documentDirectory}reduxPersist/${sanitizedKey}`

    // Get metadata about the file
    const fileInfo = await FileSystem.getInfoAsync(fileUri)

    if (fileInfo.exists && fileInfo.modificationTime) {
      const now = Date.now()
      const fileAgeInMs = now - fileInfo.modificationTime * 1000 // Convert seconds to milliseconds
      console.log('Cache age:', fileAgeInMs / 60000, 'minutes')
      return fileAgeInMs // Return file age in milliseconds
    } else {
      return null // File doesn't exist
    }
  } catch (error) {
    console.error('Error checking cache age:', error)
    return null
  }
}

const CACHE_MAX_AGE = 3600 * 1000 * 12 // 12 hours in milliseconds

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
    const sanitizedKey = `edamam-${query}`.replace(/[,\s]+/g, '')
    const cachedData = await expoFileSystemStorage.getItem(sanitizedKey)

    if (cachedData) {
      const cacheAge = await getCacheAge(sanitizedKey)
      if (cacheAge !== null && cacheAge < CACHE_MAX_AGE) {
        console.warn('Using cached recipe data.')
        const parsedCachedData = JSON.parse(cachedData)
        return parsedCachedData
      } else {
        console.log('Cached data is expired, fetching fresh data...')
      }
    }

    // Fetch fresh data from API
    const response = await axios.get(url, { params })
    console.log('Fetched fresh data:', response.data.hits[0]?.recipe?.label)

    // Store the fetched data in FileSystemStorage
    await expoFileSystemStorage.setItem(
      sanitizedKey,
      JSON.stringify(response.data),
    )
    console.log('Stored fresh data in cache.')
    return response.data
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
