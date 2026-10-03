import { StyleSheet, Text, View } from 'react-native'
import type { MergeTier } from '@/lib/merge/types'

type MergeItemProps = {
  tier: MergeTier
  compact?: boolean
}

const MergeItem = ({ tier, compact = false }: MergeItemProps) => {
  const size = compact ? 44 : 56

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.token,
          {
            width: size,
            height: size,
            backgroundColor: tier.color,
            borderRadius: tier.shape === 'circle' ? size / 2 : 14,
          },
        ]}
      />
      {!compact ? <Text style={styles.label}>{tier.name}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  token: {
    borderWidth: 1.5,
    borderColor: 'rgba(45, 42, 38, 0.18)',
  },
  label: {
    fontFamily: 'Nimbus',
    fontSize: 10,
    color: 'rgba(45, 42, 38, 0.72)',
    textAlign: 'center',
  },
})

export default MergeItem
