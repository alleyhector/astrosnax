import { Image, ImageSourcePropType, StyleSheet } from 'react-native'
import { FC } from 'react'
import { Text, View } from '@/components/Themed'
import { imagesMap } from '@/assets/glyphs/exports'
import { card } from '@/constants/Styles'
import { TransitsProps } from '@/types/contentful'
import Recipes from './Recipes'

const Transits: FC<TransitsProps> = ({ transits }) => {
  const getFood = (foods: string) => {
    switch (foods) {
      case 'Sun':
        return ['lemon', 'mexican']
        break
      case 'Moon':
      case 'New Moon':
      case 'Full Moon':
        return ['rice', 'indian']
        break
      case 'Mercury':
        return ['coffee', 'american']
        break
      case 'Venus':
        return ['chocolate', 'french']
        break
      case 'Mars':
        return ['cheese', 'italian']
        break
      case 'Jupiter':
        return ['pasta', 'greek']
        break
      case 'Saturn':
        return ['potato', 'central europe']
        break
      case 'Uranus':
        return ['spicy', 'caribbean']
        break
      case 'Neptune':
        return ['soup', 'mediterranean']
        break
      case 'Pluto':
        return ['fermented', 'asian']
        break
      case 'Aries':
        return ['beans', 'american']
        break
      case 'Taurus':
        return ['butter', 'french']
        break
      case 'Gemini':
        return ['pie', 'middle eastern']
        break
      case 'Cancer':
        return ['bread', 'italian']
        break
      case 'Leo':
        return ['honey', 'mexican']
        break
      case 'Virgo':
        return ['tomato', 'nordic']
        break
      case 'Libra':
        return ['oregano', 'south american']
        break
      case 'Scorpio':
        return ['oil', 'indian']
        break
      case 'Sagittarius':
        return ['pepper', 'caribbean']
        break
      case 'Capricorn':
        return ['garlic', 'british']
        break
      case 'Aquarius':
        return ['vinegar', 'asian']
        break
      case 'Pisces':
        return ['wine', 'eastern europe']
        break
      case 'trine':
        return 'salt'
        break
      case 'sextile':
        return 'sweet'
        break
      case 'square':
        return 'bitter'
        break
      case 'opposition':
        return 'sour'
        break
      case 'conjunction':
        return 'hash'
        break
      case 'ingress':
        return 'spicy'
      default:
        return ''
        break
    }
  }

  return (
    <>
      {/* Ingresses, i.e. don't have a transiting planet */}
      {transits &&
        transits.map((transit, index) => {
          return (
            <View style={card} key={index}>
              {transit.aspect === 'ingress' ? (
                <>
                  <Text
                    style={styles.transitText}
                  >{`${transit.planet} enters ${transit.sign}`}</Text>

                  <View style={styles.container}>
                    <Image
                      style={styles.image}
                      source={
                        imagesMap[transit?.planet ?? ''] as ImageSourcePropType
                      }
                    />

                    <Image
                      style={styles.image}
                      source={
                        imagesMap[transit?.aspect ?? ''] as ImageSourcePropType
                      }
                    />
                    <Image
                      style={styles.image}
                      source={
                        imagesMap[transit?.sign ?? ''] as ImageSourcePropType
                      }
                    />
                  </View>
                  <Recipes
                    query={`${getFood(transit.planet)[0]},${
                      getFood(transit.sign)[0]
                    },${getFood(transit.aspect)}`}
                    cuisineType={getFood(transit.planet)[1] ?? ''}
                  />
                </>
              ) : (
                <>
                  {/* All normal transits with a transiting planet */}
                  <Text style={styles.transitText}>
                    {`${transit.planet} in ${transit.sign} `}
                    {transit.transitingPlanet &&
                      `${transit?.aspect} ${transit?.transitingPlanet} in ${transit?.transitingSign}`}
                  </Text>

                  <View style={styles.container}>
                    {transit?.planet === 'New Moon' ||
                    transit?.planet === 'Full Moon' ? (
                      <>
                        <Image
                          style={styles.image}
                          source={imagesMap['Moon'] as ImageSourcePropType}
                        />
                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.sign ?? ''
                            ] as ImageSourcePropType
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.planet ?? ''
                            ] as ImageSourcePropType
                          }
                        />

                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.sign ?? ''
                            ] as ImageSourcePropType
                          }
                        />
                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.aspect ?? ''
                            ] as ImageSourcePropType
                          }
                        />
                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.transitingPlanet ?? ''
                            ] as ImageSourcePropType
                          }
                        />
                        <Image
                          style={styles.image}
                          source={
                            imagesMap[
                              transit?.transitingSign ?? ''
                            ] as ImageSourcePropType
                          }
                        />
                      </>
                    )}
                  </View>
                </>
              )}

              <Recipes
                query={`${getFood(transit.planet)[0]},${
                  getFood(transit.sign)[0]
                },${getFood(transit.aspect ?? '')},${
                  getFood(transit.transitingPlanet)[0] ?? ''
                },${getFood(transit.transitingSign)[0] ?? ''}`}
                cuisineType={getFood(transit.planet)[1] ?? ''}
              />
            </View>
          )
        })}
    </>
  )
}

export default Transits

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transitText: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    flex: 1,
    backgroundColor: 'transparent',
  },
  recipeimage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    flex: 1,
    backgroundColor: 'transparent',
  },
})
