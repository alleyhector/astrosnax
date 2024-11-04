import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { View, Text } from './Themed'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import { TouchableOpacity, Linking } from 'react-native'
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
  console.log(query)
  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])

  // Function to fetch the recipe based on the query
  const getRecipe = async ({ query }: RecipeProps) => {
    const data = await searchRecipe({ query })

    if (data) {
      setRecipes(data.hits.slice(0, 2))
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      getRecipe({ query })
    }
  }, [query])

  return (
    <View style={[column, card, backgroundColorVar1]}>
      {recipes &&
        recipes.map((recipe, index) => (
          <View style={[row, backgroundColorVar1]} key={index}>
            <View>
              <Image source={{ uri: recipe.recipe.image }} style={apiImage} />
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
    </View>
  )
}

export default Recipes
