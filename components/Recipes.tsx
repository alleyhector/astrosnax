import { memo, useEffect, useState } from 'react'
import { View, Text } from './Themed'
import { Image, ActivityIndicator, useColorScheme } from 'react-native'
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
import { ExternalLink } from './ExternalLink'
import { searchRecipe as searchMealRecipe } from '@/API/MealRecipesAPI'

interface ExtendedRecipeProps extends RecipeProps {
  fallbackFood?: string | string[]
}

interface Meal {
  strMeal: string
  strMealThumb: string
  strYoutube: string
}

const Recipes = ({ query, fallbackFood }: ExtendedRecipeProps) => {
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackgroundFood,
  }

  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])
  const [fallbackRecipes, setFallbackRecipes] = useState<Meal[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Function to fetch the recipe based on the query
  const fetchRecipe = async ({ query, fallbackFood }: ExtendedRecipeProps) => {
    setLoading(true)
    try {
      console.log('QUERY: ', query, fallbackFood)
      const data = await searchRecipe({ query })
      console.log('data:', data.hits[0].recipe.label)
      if (data) {
        setRecipes(data.hits.slice(0, 2))
      }
    } catch (error) {
      console.error('Error fetching recipes from EdamAPI:', error)
    }

    try {
      const fallbackData = await searchMealRecipe({ fallbackFood })
      console.log('fallbackData:', fallbackData.meals[0].strMeal)
      if (fallbackData) {
        setFallbackRecipes(fallbackData.meals.slice(0, 2))
      }
    } catch (error) {
      console.error('Error fetching recipes from MealAPI:', error)
    } finally {
      setLoading(false)
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query || fallbackFood) {
      fetchRecipe({ query, fallbackFood })
    }
  }, [query, fallbackFood])

  console.log('RC: ', recipes.length)
  console.log('FBRC: ', fallbackRecipes.length)

  return (
    <View style={[column, card, cardBackground]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {recipes.length > 0 ? (
            // Render recipes
            recipes.map((recipe, index) => (
              <View style={[row, cardBackground]} key={index}>
                <View>
                  <Image
                    source={{ uri: recipe.recipe.image }}
                    style={apiImage}
                  />
                </View>
                <View style={[apiTextContainer, cardBackground]}>
                  <ExternalLink href={recipe.recipe.url}>
                    <View style={cardBackground}>
                      <Text style={apiTitle}>{recipe.recipe.label}</Text>
                    </View>
                    <View style={cardBackground}>
                      <Text>View Recipe</Text>
                    </View>
                  </ExternalLink>
                </View>
              </View>
            ))
          ) : fallbackRecipes.length > 0 ? (
            // Render fallback recipes
            fallbackRecipes.map((meal, index) => (
              <View style={[row, cardBackground]} key={index}>
                <View>
                  <Image source={{ uri: meal.strMealThumb }} style={apiImage} />
                </View>
                <View style={[apiTextContainer, cardBackground]}>
                  <ExternalLink href={meal.strYoutube}>
                    <View style={cardBackground}>
                      <Text style={apiTitle}>{meal.strMeal}</Text>
                    </View>
                    <View style={cardBackground}>
                      <Text>View Recipe</Text>
                    </View>
                  </ExternalLink>
                </View>
              </View>
            ))
          ) : (
            // Last-resort fallback text
            <Text style={apiTitle}>
              Oof I guess today's transit means you're going hungry...
            </Text>
          )}
        </>
      )}
    </View>
  )
}

export default memo(Recipes)
