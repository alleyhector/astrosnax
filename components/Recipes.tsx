import { useEffect, useState } from 'react'
import { View, Text } from './Themed'
import {
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import {
  card,
  column,
  apiImage,
  apiTextContainer,
  row,
  apiTitle,
} from '@/constants/Styles'
import Colors from '@/constants/Colors'

const Recipes = ({ query }: RecipeProps) => {
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackgroundFood,
  }

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
    <View style={[column, card, cardBackground]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {recipes.length > 1 ? (
            recipes.map((recipe, index) => (
              <View style={[row, cardBackground]} key={index}>
                <View>
                  <Image
                    source={{ uri: recipe.recipe.image }}
                    style={apiImage}
                  />
                </View>
                <View style={[apiTextContainer, cardBackground]}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(recipe.recipe.url)}
                  >
                    <Text style={apiTitle}>{recipe.recipe.label}</Text>
                    <Text>View Recipe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={apiTitle}>
              Oof I guess today's transit means you're going hungry...
            </Text>
          )}
        </>
      )}
    </View>
  )
}

export default Recipes
