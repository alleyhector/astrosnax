import { ScrollView, StyleSheet, Image } from 'react-native'
import { textShadow } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View } from '@/components/Themed'
import Today from '@/components/Today'
import SpotifyPlaylist from '@/components/SpotifyPlaylist'

const HomeScreen = () => {
  const insets = useSafeAreaInsets()
  // const playlists = searchPlaylists('pop')
  // console.log(playlists)

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}
    >
      <SpotifyPlaylist />
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
