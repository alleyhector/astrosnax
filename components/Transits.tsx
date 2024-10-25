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
      case 'Moon':
      case 'New Moon':
      case 'Full Moon':
        return ['rice', 'indian']
      case 'Mercury':
        return ['coffee', 'american']
      case 'Venus':
        return ['egg', 'french']
      case 'Mars':
        return ['cheese', 'italian']
      case 'Jupiter':
        return ['chicken', 'greek']

      case 'Saturn':
        return ['potato', 'central europe']

      case 'Uranus':
        return ['spicy', 'caribbean']

      case 'Neptune':
        return ['oil', 'mediterranean']

      case 'Pluto':
        return ['mushroom', 'asian']
      case 'Aries':
        return ['beans', 'american']
      case 'Taurus':
        return ['butter', 'french']
      case 'Gemini':
        return ['onion', 'middle eastern']
      case 'Cancer':
        return ['bread', 'italian']
      case 'Leo':
        return ['honey', 'mexican']
      case 'Virgo':
        return ['tomato', 'nordic']
      case 'Libra':
        return ['oregano', 'south american']
      case 'Scorpio':
        return ['oil', 'indian']
      case 'Sagittarius':
        return ['pepper', 'caribbean']
      case 'Capricorn':
        return ['garlic', 'british']
      case 'Aquarius':
        return ['vinegar', 'asian']
      case 'Pisces':
        return ['fish', 'eastern europe']
      case 'trine':
        return 'salt'
      case 'sextile':
        return 'sweet'
      case 'square':
        return 'bitter'
      case 'opposition':
        return 'sour'
      case 'conjunction':
        return 'hash'
      case 'ingress':
        return 'spicy'
      default:
        return ''
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
              {transit.aspect === 'ingress' ? (
                <Recipes
                  query={`${getFood(transit.planet)[0]},${
                    getFood(transit.sign)[0]
                  },${getFood(transit.aspect)}`}
                  cuisineType={getFood(transit.planet)[1] ?? ''}
                />
              ) : (
                <Recipes
                  query={`${getFood(transit.planet)[0]},${
                    getFood(transit.sign)[0]
                  },${getFood(transit.transitingPlanet)[0] ?? ''},${
                    getFood(transit.transitingSign)[0] ?? ''
                  },${getFood(transit.aspect)}`}
                  cuisineType={getFood(transit.planet)[1] ?? ''}
                />
              )}
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
    marginBottom: 30,
  },
  transitText: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    flex: 1,
    backgroundColor: 'transparent',
  },
})
