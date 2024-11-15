import { ScrollView, StyleSheet, Image } from 'react-native'
import { container, textShadow } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { DefaultTheme } from '@react-navigation/native'
import { Text, View } from '@/components/Themed'
import Today from '@/components/Today'

const HomeScreen = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        display: 'flex',
        backgroundColor: colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
      }}
    >
      <View style={container}>
        <Text style={styles.title}>AstroSnax</Text>
        <Text style={styles.subtitle}>Food for celestial thought</Text>
        <Text style={styles.p}>
          What's the astrological weather report for today? Below you will find
          a list of today's transits. Interpret them how you will. I have done
          so by providing recipes created with the mashup of these cosmological
          characters and dishes that express how their powers combine...for
          better or worse...
        </Text>
        <Image
          style={styles.logo}
          source={require('../../assets/images/icon.png')}
        />
        <Today />
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
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
    fontFamily: 'Nimbus',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
  },
  logo: {
    width: 300,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
