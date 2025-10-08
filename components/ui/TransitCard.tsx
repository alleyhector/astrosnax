import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { FC, memo } from 'react'
import { Text, View } from '@/components/Themed'
import { imagesMap } from '@/assets/glyphs/exports'
import { card } from '@/constants/Styles'
import Recipes from '../Recipes'
import Playlists from '../SpotifyPlaylist'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

interface TransitCardProps {
  transitText: string
  glyphs: string[]
  recipeQuery: string
  recipeFallbackFood: string | string[]
  spotifyQuery: string
}

const TransitCard: FC<TransitCardProps> = ({
  transitText,
  glyphs,
  recipeQuery,
  recipeFallbackFood,
  spotifyQuery,
}) => {
  const colorScheme = useColorScheme()
  const cardBackground = {
    backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
  }

  return (
    <View style={[card, cardBackground]}>
      <Text style={styles.transitText}>{transitText}</Text>

      <View style={styles.glyphContainer}>
        {glyphs.map((glyph, index) => {
          // Use ingress image for retrograde/direct, but transform it
          const glyphKey =
            glyph === 'retrograde' || glyph === 'direct' ? 'ingress' : glyph
          const imageStyle = [
            styles.image,
            glyph === 'retrograde' && { transform: [{ scaleX: -1 }] },
          ]

          return (
            <Image
              key={index}
              style={imageStyle}
              source={imagesMap[glyphKey]}
              alt={`${glyph} glyph`}
              contentFit='contain'
            />
          )
        })}
      </View>

      <Recipes fallbackFood={recipeFallbackFood} query={recipeQuery} />

      <Playlists foodQuery={recipeQuery} transitQuery={spotifyQuery} />
    </View>
  )
}

export default memo(TransitCard)

const styles = StyleSheet.create({
  glyphContainer: {
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
    flex: 1,
    backgroundColor: 'transparent',
  },
})
