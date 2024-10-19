import { ScrollView, StyleSheet } from 'react-native'
import { textShadow } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View } from '@/components/Themed'
import Today from '@/components/Today'
import Tomorrow from '@/components/Tomorrow'

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
          <Today />
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
