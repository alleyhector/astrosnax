import { ScrollView, StyleSheet } from 'react-native'
import { textShadow } from '@/constants/Styles'
import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AstroSnax</Text>
      <Text style={styles.subtitle}>Food for celestial thought</Text>
      <EditScreenInfo path='app/(tabs)/index.tsx' />
    </View>
  )
}

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
