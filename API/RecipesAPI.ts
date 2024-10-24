import { RecipeProps } from '@/types/edamam'
import axios from 'axios'

const appId = process.env.EXPO_PUBLIC_EDAMAM_ID
const appKey = process.env.EXPO_PUBLIC_EDAMAM_KEY

export const searchRecipe = async ({ query, cuisineType }: RecipeProps) => {
  const url = 'https://api.edamam.com/api/recipes/v2'
  const params = {
    type: 'public', // Required parameter
    q: query, // Search query (e.g., "chicken")
    app_id: appId,
    app_key: appKey,
    cuisineType: cuisineType, // Optional parameter
  }

  try {
    const response = await axios.get(url, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching recipe data:', error)
    return null
  }
}
