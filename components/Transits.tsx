import { Image, ImageSourcePropType, StyleSheet } from 'react-native'
import { FC } from 'react'
import { Text, View } from '@/components/Themed'
import { imagesMap } from '@/assets/glyphs/exports'
import { card } from '@/constants/Styles'

interface Transit {
  planet: string
  sign: string
  aspect: string
  transitingPlanet?: string
  transitingSign?: string
}

interface TransitsProps {
  transits: Transit[]
}

const Transits: FC<TransitsProps> = ({ transits }) => {
  return (
    <>
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
})
