import { ScrollView, StyleSheet, Image } from 'react-native'
import { textShadow } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View } from '@/components/Themed'
import Today from '@/components/Today'

const HomeScreen = () => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>AstroSnax</Text>
          <Text style={styles.subtitle}>Food for celestial thought</Text>
          <Text style={styles.p}>
            What's the astrological weather report for today? Below you will
            find a list of today's transits. Interpret them how you will. I have
            done so by providing recipes created with the mashup of these
            cosmological characters and dishes that express how their powers
            combine...for better or worse...
          </Text>
          <Image
            style={styles.logo}
            source={require('../../assets/images/icon.png')}
          />
          <Today />
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'AngelClub',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    ...textShadow,
  },
  subtitle: {
    fontFamily: 'AngelClub',
    fontSize: 22,
    margin: 10,
    textAlign: 'center',
    ...textShadow,
  },
  p: {
    fontFamily: 'NimbusRegular',
    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 0,
  },
  logo: {
    width: 300,
    height: 250,
    resizeMode: 'cover',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
