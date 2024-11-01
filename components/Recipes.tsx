import { useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { View, Text } from './Themed'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import { TouchableOpacity, Linking } from 'react-native'

const Recipes = ({ query }: RecipeProps) => {
  console.log(query)
  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])

  // Function to fetch the recipe based on the query
  const displayRecipe = async ({ query }: RecipeProps) => {
    const data = await searchRecipe({ query })

    if (data) {
      setRecipes(data.hits.slice(0, 2))
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      displayRecipe({ query })
    }
  }, [query])

  return (
    <View style={styles.container}>
      {recipes &&
        recipes.map((recipe, index) => (
          <View style={styles.flex} key={index}>
            <View>
              <Image
                source={{ uri: recipe.recipe.image }}
                style={styles.recipeImage}
              />
            </View>
            <View style={styles.recipeTextContainer}>
              <TouchableOpacity
                onPress={() => Linking.openURL(recipe.recipe.url)}
              >
                <Text style={styles.recipeTitle}>{recipe.recipe.label}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2ead8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#f2ead8',
  },

  recipeImageContainer: {
    flex: 1,
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2ead8',
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    textAlign: 'center',
  },
  recipeTitle: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 16,
    textAlign: 'left',
  },
})
