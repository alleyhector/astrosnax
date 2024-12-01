import { Image, StyleSheet, ViewStyle } from 'react-native'
import { FC } from 'react'
import { Text, View } from '@/components/Themed'
import { imagesMap } from '@/assets/glyphs/exports'
import { card } from '@/constants/Styles'
import { Transit, TransitsProps } from '@/types/contentful'
import Recipes from './Recipes'
import Playlists from './SpotifyPlaylist'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

const Transits: FC<TransitsProps> = ({ transits }) => {
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
  }
  const getFood = (foods: string) => {
    switch (foods) {
      case 'Sun':
        return ['lemon', 'mexican']
      case 'Moon':
      case 'New Moon':
      case 'Full Moon':
        return ['rice', 'indian']
      case 'Mercury':
        return ['quick', 'american']
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
        return ['seafood', 'mediterranean']
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

  const buildQuery = (transit: Transit) => {
    if (transit.foods !== undefined && transit.foods !== null) {
      return transit.foods.toString()
    } else {
      const planetFood = getFood(transit.planet)
      const signFood = getFood(transit.sign)
      const transitingPlanetFood = getFood(transit.transitingPlanet)
      const transitingSignFood = getFood(transit.transitingSign)
      const aspectFood = getFood(transit.aspect)
      const query =
        transit.aspect === 'ingress'
          ? `${planetFood[0]},${signFood[0]},${aspectFood}`
          : `${planetFood[0]},${signFood[0]},${transitingPlanetFood[0] ?? ''},${transitingSignFood[0] ?? ''},${aspectFood}`
      return query
    }
  }

  return (
    <>
      {/* Ingresses, i.e. don't have a transiting planet */}
      {transits &&
        transits.map((transit, index) => {
          return (
            <View style={[card, cardBackground]} key={index}>
              {transit.aspect === 'ingress' ? (
                <>
                  <Text
                    style={styles.transitText}
                  >{`${transit.planet} enters ${transit.sign}`}</Text>

                  <View style={styles.container}>
                    <Image
                      style={styles.image}
                      source={imagesMap[transit?.planet ?? '']}
                    />

                    <Image
                      style={styles.image}
                      source={imagesMap[transit?.aspect ?? '']}
                    />
                    <Image
                      style={styles.image}
                      source={imagesMap[transit?.sign ?? '']}
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
                          source={imagesMap['Moon']}
                        />
                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.sign ?? '']}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.planet ?? '']}
                        />

                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.sign ?? '']}
                        />
                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.aspect ?? '']}
                        />
                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.transitingPlanet ?? '']}
                        />
                        <Image
                          style={styles.image}
                          source={imagesMap[transit?.transitingSign ?? '']}
                        />
                      </>
                    )}
                  </View>
                </>
              )}
              <Recipes query={buildQuery(transit)} />
              <Playlists
                foodQuery={buildQuery(transit)}
                transitQuery={
                  transit.aspect === 'ingress'
                    ? `${transit.planet} enters ${transit.sign}`
                    : `${transit.planet} in ${transit.sign} ${transit?.aspect} ${transit?.transitingPlanet} in ${transit?.transitingSign}`
                }
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
    marginBottom: 30,
  },
  transitText: {
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'NimbusBold',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    flex: 1,
    backgroundColor: 'transparent',
  },
})
