import AsyncStorage from '@react-native-async-storage/async-storage'
import type { BoardState, MergePack } from './types'
import { createStarterBoard, isValidBoardState } from './board'

const STORAGE_KEY = '@astrosnax/merge-board-v1'

export async function loadBoard(pack: MergePack): Promise<BoardState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return createStarterBoard(pack)

    const parsed: unknown = JSON.parse(raw)
    if (isValidBoardState(parsed, pack)) return parsed
  } catch (error) {
    console.warn('Failed to load merge board; using starter board.', error)
  }

  return createStarterBoard(pack)
}

export async function saveBoard(board: BoardState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  } catch (error) {
    console.warn('Failed to save merge board.', error)
  }
}

export async function clearBoardSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear merge board save.', error)
  }
}
