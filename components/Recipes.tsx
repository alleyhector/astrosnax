import { useEffect, useState } from 'react'
import { View, Text } from './Themed'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import {
  card,
  backgroundColorVar1,
  column,
  apiImage,
  apiTextContainer,
  row,
  apiTitle,
} from '@/constants/Styles'

const Recipes = ({ query }: RecipeProps) => {
  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Function to fetch the recipe based on the query
  const fetchRecipe = async ({ query }: RecipeProps) => {
    setLoading(true)
    try {
      const data = await searchRecipe({ query })

      if (data) {
        setRecipes(data.hits.slice(0, 2))
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      fetchRecipe({ query })
    }
  }, [query])

  return (
    <View style={[column, card, backgroundColorVar1]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {recipes &&
            recipes.map((recipe, index) => (
              <View style={[row, backgroundColorVar1]} key={index}>
                <View>
                  <Image
                    source={{ uri: recipe.recipe.image }}
                    style={apiImage}
                  />
                </View>
                <View style={[apiTextContainer, backgroundColorVar1]}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(recipe.recipe.url)}
                  >
                    <Text style={apiTitle}>{recipe.recipe.label}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(recipe.recipe.url)}
                  >
                    <Text>View Recipe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </>
      )}
    </View>
  )
}

export default Recipes
