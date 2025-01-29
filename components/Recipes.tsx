import { FC, memo, useEffect, useState } from 'react'
import { View, Text } from './Themed'
import { ActivityIndicator, useColorScheme } from 'react-native'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import { card, column, apiTitle } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { searchRecipe as searchMealRecipe } from '@/API/MealRecipesAPI'
import Card from './ui/Card'

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

const RecipeList: FC<RecipeListProps> = ({ recipes, cardBackground }) => (
  <>
    {recipes &&
      recipes.map((recipe) => (
        <Card
          key={recipe.recipe.uri}
          background={cardBackground}
          imageUrl={recipe.recipe.image}
          alt={`${recipe.recipe.label} photo`}
          title={recipe.recipe.label}
          description='View Recipe'
          link={recipe.recipe.url}
        />
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
        <Card
          key={meal.idMeal}
          background={cardBackground}
          imageUrl={meal.strMealThumb}
          alt={`${meal.strMeal} photo`}
          title={meal.strMeal}
          description='View Recipe'
          link={meal.strYoutube}
        />
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
