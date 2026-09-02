import { FC, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import Transits from '@/components/Transits'
import { TransitWithLiveAt } from '@/types/contentful'
import { getMenuTransits } from '@/lib/transitTimes'

const Today: FC<{ occurrences: TransitWithLiveAt[] }> = ({ occurrences }) => {
  const { menuTransits, isToday } = useMemo(
    () => getMenuTransits(occurrences),
    [occurrences],
  )

  return (
    <View style={styles.container}>
      {menuTransits.length === 0 ? (
        <Text style={styles.menu}>No live transits yet.</Text>
      ) : isToday ? (
        <Text style={styles.menu}>On today’s astrological menu:</Text>
      ) : (
        <Text style={styles.menu}>
          There may not be any direct transits today but you (and your stomach)
          are probably still feeling the weight these recently transiting
          bodies.
        </Text>
      )}

      {menuTransits.length > 0 && <Transits transits={menuTransits} />}
    </View>
  )
}

export default Today

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menu: {
    fontFamily: 'AngelClub',
    fontSize: 20,
    margin: 10,
  },
})
