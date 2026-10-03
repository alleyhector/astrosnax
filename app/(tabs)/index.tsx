import { ScrollView, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View } from '@/components/Themed'
import MergeBoard from '@/components/merge/MergeBoard'
import Colors from '@/constants/Colors'
import { container, textShadow } from '@/constants/Styles'
import { useColorScheme } from '@/components/useColorScheme'
import { activeMergePack } from '@/lib/merge/pack'

/**
 * Merge board home stub.
 * Match-3 levels, rewarded ads, and IAP are deferred — see README.
 */
const GardenScreen = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme].background,
        colorScheme === 'dark' ? '#1a2218' : '#e8d5c4',
      ]}
      start={{ x: 0.5, y: 0.15 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[container, styles.inner]}>
          <Text style={styles.brand}>AstroSnax</Text>
          <Text style={styles.title}>{activeMergePack.name}</Text>
          <Text style={styles.subtitle}>
            A small garden of sky pieces. Merge matches to climb the chain.
          </Text>
          <MergeBoard />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inner: {
    gap: 6,
  },
  brand: {
    fontFamily: 'AngelClub',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 8,
    ...textShadow,
  },
  title: {
    fontFamily: 'AngelClub',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  subtitle: {
    fontFamily: 'Nimbus',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 8,
    lineHeight: 22,
    opacity: 0.78,
  },
})

export default GardenScreen
