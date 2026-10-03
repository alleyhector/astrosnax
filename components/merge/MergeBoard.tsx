/* Reanimated shared values are mutated via `.value` inside worklets. */
/* eslint-disable react-hooks/immutability */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import MergeItem from '@/components/merge/MergeItem'
import { useColorScheme } from '@/components/useColorScheme'
import {
  applyDrop,
  createStarterBoard,
  spawnLowestTier,
} from '@/lib/merge/board'
import { clearBoardSave, loadBoard, saveBoard } from '@/lib/merge/persistence'
import { activeMergePack, getTier, maxTierIndex } from '@/lib/merge/pack'
import type { BoardState } from '@/lib/merge/types'

const GAP = 8
const PAD = 10

type DraggableCellProps = {
  index: number
  board: BoardState
  cellSize: number
  onDrop: (fromIndex: number, toIndex: number) => void
  onDragActiveChange: (active: boolean) => void
}

const DraggableCell = ({
  index,
  board,
  cellSize,
  onDrop,
  onDragActiveChange,
}: DraggableCellProps) => {
  const item = board.cells[index]
  const tier = item ? getTier(activeMergePack, item.tierIndex) : undefined
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const zIndex = useSharedValue(0)
  const isDragging = useSharedValue(false)
  const stride = cellSize + GAP

  const snapHome = useCallback(() => {
    translateX.value = withSpring(0, { damping: 18, stiffness: 220 })
    translateY.value = withSpring(0, { damping: 18, stiffness: 220 })
    zIndex.value = 0
    isDragging.value = false
  }, [isDragging, translateX, translateY, zIndex])

  const handleEnd = useCallback(
    (translationX: number, translationY: number) => {
      const fromRow = Math.floor(index / board.cols)
      const fromCol = index % board.cols
      const colDelta = Math.round(translationX / stride)
      const rowDelta = Math.round(translationY / stride)
      const toCol = fromCol + colDelta
      const toRow = fromRow + rowDelta
      const inBounds =
        toCol >= 0 && toCol < board.cols && toRow >= 0 && toRow < board.rows

      if (inBounds) {
        const target = toRow * board.cols + toCol
        if (target !== index) {
          onDrop(index, target)
        }
      }

      onDragActiveChange(false)
      snapHome()
    },
    [
      board.cols,
      board.rows,
      index,
      onDragActiveChange,
      onDrop,
      snapHome,
      stride,
    ],
  )

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(Boolean(item))
        .minDistance(4)
        .onStart(() => {
          'worklet'
          isDragging.value = true
          zIndex.value = 20
          runOnJS(onDragActiveChange)(true)
        })
        .onUpdate((event) => {
          'worklet'
          translateX.value = event.translationX
          translateY.value = event.translationY
        })
        .onEnd((event) => {
          'worklet'
          runOnJS(handleEnd)(event.translationX, event.translationY)
        })
        .onFinalize(() => {
          'worklet'
          if (isDragging.value) {
            runOnJS(onDragActiveChange)(false)
            translateX.value = withSpring(0, { damping: 18, stiffness: 220 })
            translateY.value = withSpring(0, { damping: 18, stiffness: 220 })
            zIndex.value = 0
            isDragging.value = false
          }
        }),
    [
      handleEnd,
      isDragging,
      item,
      onDragActiveChange,
      translateX,
      translateY,
      zIndex,
    ],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: isDragging.value ? 1.06 : 1 },
    ],
    zIndex: zIndex.value,
  }))

  if (!item || !tier) {
    return <View style={[styles.cell, { width: cellSize, height: cellSize }]} />
  }

  const webTouchStyle =
    Platform.OS === 'web'
      ? ({ touchAction: 'none' } as unknown as ViewStyle)
      : null

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.cell,
          styles.filledCell,
          { width: cellSize, height: cellSize },
          webTouchStyle,
          animatedStyle,
        ]}
      >
        <MergeItem tier={tier} />
      </Animated.View>
    </GestureDetector>
  )
}

type MergeBoardProps = {
  onDraggingChange?: (dragging: boolean) => void
}

const MergeBoard = ({ onDraggingChange }: MergeBoardProps) => {
  const pack = activeMergePack
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const mutedText = isDark
    ? 'rgba(254, 250, 224, 0.78)'
    : 'rgba(45, 42, 38, 0.78)'
  const softText = isDark
    ? 'rgba(254, 250, 224, 0.55)'
    : 'rgba(45, 42, 38, 0.55)'
  const [board, setBoard] = useState<BoardState | null>(null)
  const [boardWidth, setBoardWidth] = useState(0)
  const [status, setStatus] = useState('Drag matching pieces together.')

  useEffect(() => {
    let mounted = true
    loadBoard(pack).then((loaded) => {
      if (mounted) setBoard(loaded)
    })
    return () => {
      mounted = false
    }
  }, [pack])

  useEffect(() => {
    if (!board) return
    void saveBoard(board)
  }, [board])

  const onBoardLayout = useCallback((event: LayoutChangeEvent) => {
    setBoardWidth(event.nativeEvent.layout.width)
  }, [])

  const onDragActiveChange = useCallback(
    (active: boolean) => {
      onDraggingChange?.(active)
    },
    [onDraggingChange],
  )

  const cellSize = useMemo(() => {
    if (!board || boardWidth <= 0) return 64
    const inner = boardWidth - PAD * 2 - GAP * (board.cols - 1)
    return Math.floor(inner / board.cols)
  }, [board, boardWidth])

  const handleDrop = useCallback(
    (fromIndex: number, toIndex: number) => {
      setBoard((current) => {
        if (!current) return current
        const result = applyDrop(
          current,
          fromIndex,
          toIndex,
          maxTierIndex(pack),
        )
        if (!result.didChange) {
          setStatus('Those pieces don’t combine — try a match.')
          return current
        }
        if (result.merged) {
          const tier = getTier(
            pack,
            result.board.cells[toIndex]?.tierIndex ?? 0,
          )
          setStatus(
            tier ? `Merged into ${tier.name}.` : 'Merged into the next tier.',
          )
        } else {
          setStatus('Moved.')
        }
        return result.board
      })
    },
    [pack],
  )

  const handleSpawn = useCallback(() => {
    setBoard((current) => {
      if (!current) return current
      const next = spawnLowestTier(current)
      if (next === current) {
        setStatus('Board is full — merge to make space.')
        return current
      }
      const spark = pack.chain[0]?.name ?? 'Spark'
      setStatus(`A new ${spark} settled in.`)
      return next
    })
  }, [pack.chain])

  const handleReset = useCallback(async () => {
    await clearBoardSave()
    setBoard(createStarterBoard(pack))
    setStatus('Garden reset. Drag matching pieces together.')
  }, [pack])

  if (!board) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={[styles.hint, { color: mutedText }]}>{status}</Text>

      <View
        style={[
          styles.board,
          {
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.22)'
              : 'rgba(255, 255, 255, 0.42)',
            borderColor: isDark
              ? 'rgba(254, 250, 224, 0.1)'
              : 'rgba(45, 42, 38, 0.08)',
          },
        ]}
        onLayout={onBoardLayout}
      >
        {Array.from({ length: board.rows }, (_, row) => (
          <View key={`row-${row}`} style={styles.row}>
            {Array.from({ length: board.cols }, (_, col) => {
              const index = row * board.cols + col
              return (
                <View
                  key={`slot-${index}`}
                  style={[
                    styles.slot,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: isDark
                        ? 'rgba(254, 250, 224, 0.06)'
                        : 'rgba(45, 42, 38, 0.05)',
                    },
                  ]}
                >
                  <DraggableCell
                    index={index}
                    board={board}
                    cellSize={cellSize}
                    onDrop={handleDrop}
                    onDragActiveChange={onDragActiveChange}
                  />
                </View>
              )
            })}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole='button'
          onPress={handleSpawn}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Add spark</Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={handleReset}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            {
              borderColor: isDark
                ? 'rgba(254, 250, 224, 0.28)'
                : 'rgba(45, 42, 38, 0.22)',
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.secondaryButtonText, { color: mutedText }]}>
            Reset
          </Text>
        </Pressable>
      </View>

      <View style={styles.chain}>
        <Text style={[styles.chainTitle, { color: softText }]}>
          Merge chain
        </Text>
        <View style={styles.chainRow}>
          {pack.chain.map((tier) => (
            <View key={tier.id} style={styles.chainItem}>
              <MergeItem tier={tier} compact />
              <Text style={[styles.chainLabel, { color: mutedText }]}>
                {tier.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  loading: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: 'Nimbus',
    fontSize: 15,
    textAlign: 'center',
    color: 'rgba(45, 42, 38, 0.78)',
    minHeight: 40,
  },
  board: {
    padding: PAD,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(45, 42, 38, 0.08)',
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  slot: {
    borderRadius: 14,
    backgroundColor: 'rgba(45, 42, 38, 0.05)',
    overflow: 'visible',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  filledCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#5A7A6A',
  },
  primaryButtonText: {
    fontFamily: 'NimbusBold',
    color: '#FDF8F2',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(45, 42, 38, 0.22)',
  },
  secondaryButtonText: {
    fontFamily: 'Nimbus',
    color: 'rgba(45, 42, 38, 0.8)',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.85,
  },
  chain: {
    gap: 10,
  },
  chainTitle: {
    fontFamily: 'NimbusBold',
    fontSize: 13,
    letterSpacing: 0.4,
    color: 'rgba(45, 42, 38, 0.55)',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  chainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  chainItem: {
    alignItems: 'center',
    width: 64,
    gap: 4,
  },
  chainLabel: {
    fontFamily: 'Nimbus',
    fontSize: 10,
    color: 'rgba(45, 42, 38, 0.65)',
    textAlign: 'center',
  },
})

export default MergeBoard
