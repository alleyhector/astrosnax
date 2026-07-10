import { FC, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import Transits from '@/components/Transits'
import { TransitQueryResponse } from '@/types/contentful'
import { isSameLocalDay } from '@/lib/pacificTime'
import {
  getLiveTransits,
  getTodaysLiveTransits,
} from '@/lib/transitTimes'

const Today: FC<{ data: TransitQueryResponse | undefined }> = ({ data }) => {
  const transits = data?.transitCollection?.items ?? []

  const { menuTransits, isToday } = useMemo(() => {
    const todays = getTodaysLiveTransits(transits)
    if (todays.length > 0) {
      return { menuTransits: todays, isToday: true }
    }

    // Fall back to the most recent live set (same local day as the newest).
    const live = getLiveTransits(transits)
    if (live.length === 0) {
      return { menuTransits: [], isToday: false }
    }

    const latestDay = live[0].liveAtUtc
    const recent = live.filter((t) => isSameLocalDay(t.liveAtUtc, latestDay))

    return { menuTransits: recent, isToday: false }
  }, [transits])

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
