import { FC, memo, useEffect, useState } from 'react'
import { View, Text } from './Themed'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { Image } from 'expo-image'
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
import { ExternalLink as ExternalLinkComponent } from './ExternalLink'
import { searchRecipe as searchMealRecipe } from '@/API/MealRecipesAPI'

interface ExtendedRecipeProps extends RecipeProps {
  fallbackFood?: string | string[]
}

interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strYoutube: string
}
interface RecipeListProps {
  recipes?: RecipeSearchResponse[]
  fallbackRecipes?: Meal[]
  cardBackground: object
}

const ExternalLink = memo(ExternalLinkComponent)

const RecipeList: FC<RecipeListProps> = ({ recipes, cardBackground }) => (
  <>
    {recipes &&
      recipes.map((recipe) => (
        <ExternalLink key={recipe.recipe.uri} href={recipe.recipe.url}>
          <View style={[row, cardBackground]}>
            <View>
              <Image
                source={{ uri: recipe.recipe.image }}
                alt={`${recipe.recipe.label} photo`}
                style={apiImage}
                placeholder={require('@/assets/images/recipe-placeholder.png')}
                placeholderContentFit='cover'
              />
            </View>
            <View style={[apiTextContainer, cardBackground]}>
              <Text style={apiTitle}>{recipe.recipe.label}</Text>
              <Text>View Recipe</Text>
            </View>
          </View>
        </ExternalLink>
      ))}
  </>
)

const FallbackRecipeList: FC<RecipeListProps> = ({
  fallbackRecipes,
  cardBackground,
}) => (
  <>
    {fallbackRecipes &&
      fallbackRecipes.map((meal) => (
        <ExternalLink key={meal.idMeal} href={meal.strYoutube}>
          <View style={[row, cardBackground]}>
            <View>
              <Image
                source={{ uri: meal.strMealThumb }}
                alt={`${meal.strMeal} photo`}
                style={apiImage}
              />
            </View>
            <View style={[apiTextContainer, cardBackground]}>
              <Text style={apiTitle}>{meal.strMeal}</Text>
              <Text>View Recipe</Text>
            </View>
          </View>
        </ExternalLink>
      ))}
  </>
)

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
      const data = await searchRecipe({ query })
      if (data && data.hits) {
        setRecipes(data.hits.slice(0, 2))
      }
    } catch (error) {
      console.error('Error fetching recipes from EdamAPI:', error)
    }

    try {
      const fallbackData = await searchMealRecipe({ fallbackFood })
      if (fallbackData && fallbackData.meals) {
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

  return (
    <View style={[column, card, cardBackground]}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          {recipes.length > 0 ? (
            <RecipeList recipes={recipes} cardBackground={cardBackground} />
          ) : fallbackRecipes.length > 0 ? (
            <FallbackRecipeList
              fallbackRecipes={fallbackRecipes}
              cardBackground={cardBackground}
            />
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

export default memo(Recipes)
