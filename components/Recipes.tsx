import { useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { View, Text } from './Themed'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'

const Recipes = ({ query, cuisineType }: RecipeProps) => {
  console.log(query, cuisineType)
  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])

  // Function to fetch the recipe based on the query
  const displayRecipe = async ({ query, cuisineType }: RecipeProps) => {
    const data = await searchRecipe({ query, cuisineType })

    // console.log(recipes[0].recipe.ingredients[0].text)

    if (data) {
      setRecipes(data.hits.slice(0, 2))
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      displayRecipe({ query, cuisineType })
    }
  }, [query])

  return (
    <View style={styles.container}>
      {recipes &&
        recipes.map((recipe, index) => (
          <View key={index}>
            <Text style={styles.recipeTitle}>{recipe.recipe.label}</Text>
            <Image
              source={{ uri: recipe.recipe.image }}
              style={styles.recipeImage}
            />
            {/* <Text>Ingredients:</Text>
            {recipe.recipe.ingredients.map((ingredient, index) => (
              <View style={styles.ingredients} key={index}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.itemText}>{ingredient.text}</Text>
              </View>
            ))} */}
          </View>
        ))}
    </View>
  )
}

export default Recipes

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTitle: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 18,
    textAlign: 'center',
  },
  recipeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  ingredients: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: 18,
    marginRight: 10, // Spacing between bullet and text
  },
  itemText: {
    fontSize: 16,
  },
})
