import { useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { View, Text } from './Themed'
import { searchRecipe } from '@/API/RecipesAPI'
import { RecipeProps, RecipeSearchResponse } from '@/types/edamam'
import { FlatList } from 'react-native'

const Recipes = ({ query }: RecipeProps) => {
  // State to store the fetched recipe data
  const [recipes, setRecipes] = useState<RecipeSearchResponse[]>([])

  // Function to fetch the recipe based on the query
  const displayRecipe = async (query: string) => {
    const data = await searchRecipe(query)
    console.log(query)

    if (data) {
      setRecipes(data.hits.slice(0, 2))
    }
  }

  // Call the API when the query changes
  useEffect(() => {
    if (query) {
      displayRecipe(query)
    }
  }, [query])

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <>
            <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
            <Image
              source={{ uri: item.recipe.image }}
              style={{ width: 100, height: 100 }}
            />
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default Recipes

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTitle: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 16,
    textAlign: 'center',
  },
})
