import axios from 'axios'

const appId = 'ec5ce3c5' // Replace with your Edamam app ID
const appKey = '0bba6fac136ae071a135afffcbdb2258' // Replace with your Edamam app key

export const searchRecipe = async (query: string) => {
  const url = 'https://api.edamam.com/api/recipes/v2'
  const params = {
    type: 'public', // Required parameter
    q: query, // Search query (e.g., "chicken")
    app_id: appId,
    app_key: appKey,
  }

  try {
    const response = await axios.get(url, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching recipe data:', error)
    return null
  }
}
