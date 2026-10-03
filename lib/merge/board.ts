import type { BoardCell, BoardItem, BoardState, MergePack } from './types'

let instanceCounter = 0

export function createItemId(): string {
  instanceCounter += 1
  return `item-${Date.now()}-${instanceCounter}`
}

export function createItem(tierIndex: number): BoardItem {
  return {
    instanceId: createItemId(),
    tierIndex,
  }
}

export function cellIndex(cols: number, row: number, col: number): number {
  return row * cols + col
}

export function createEmptyBoard(pack: MergePack): BoardState {
  const { cols, rows } = pack.board
  return {
    packId: pack.id,
    cols,
    rows,
    cells: Array.from({ length: cols * rows }, () => null),
  }
}

/** Seed a few low-tier pieces so the stub is immediately playable. */
export function createStarterBoard(pack: MergePack): BoardState {
  const board = createEmptyBoard(pack)
  const starters: { row: number; col: number; tier: number }[] = [
    { row: 1, col: 1, tier: 0 },
    { row: 1, col: 2, tier: 0 },
    { row: 2, col: 1, tier: 0 },
    { row: 2, col: 3, tier: 1 },
    { row: 3, col: 2, tier: 0 },
    { row: 3, col: 3, tier: 1 },
  ]

  for (const spot of starters) {
    if (spot.row < board.rows && spot.col < board.cols) {
      board.cells[cellIndex(board.cols, spot.row, spot.col)] = createItem(
        spot.tier,
      )
    }
  }

  return board
}

export function findEmptyCell(board: BoardState): number | null {
  for (let i = 0; i < board.cells.length; i += 1) {
    if (board.cells[i] === null) return i
  }
  return null
}

export function spawnLowestTier(board: BoardState): BoardState {
  const empty = findEmptyCell(board)
  if (empty === null) return board

  const next = [...board.cells]
  next[empty] = createItem(0)
  return { ...board, cells: next }
}

/**
 * Apply a drop from `fromIndex` onto `toIndex`.
 * - Empty target: move
 * - Matching tiers (not max): merge into next tier at target
 * - Otherwise: no change (caller snaps back)
 */
export function applyDrop(
  board: BoardState,
  fromIndex: number,
  toIndex: number,
  maxTierIndex: number,
): { board: BoardState; didChange: boolean; merged: boolean } {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= board.cells.length ||
    toIndex >= board.cells.length
  ) {
    return { board, didChange: false, merged: false }
  }

  const from = board.cells[fromIndex]
  if (!from) {
    return { board, didChange: false, merged: false }
  }

  const to = board.cells[toIndex]
  const next: BoardCell[] = [...board.cells]

  if (!to) {
    next[toIndex] = from
    next[fromIndex] = null
    return { board: { ...board, cells: next }, didChange: true, merged: false }
  }

  if (from.tierIndex === to.tierIndex && from.tierIndex < maxTierIndex) {
    next[toIndex] = createItem(from.tierIndex + 1)
    next[fromIndex] = null
    return { board: { ...board, cells: next }, didChange: true, merged: true }
  }

  return { board, didChange: false, merged: false }
}

export function isValidBoardState(
  value: unknown,
  pack: MergePack,
): value is BoardState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as BoardState
  if (candidate.packId !== pack.id) return false
  if (
    candidate.cols !== pack.board.cols ||
    candidate.rows !== pack.board.rows
  ) {
    return false
  }
  if (!Array.isArray(candidate.cells)) return false
  if (candidate.cells.length !== pack.board.cols * pack.board.rows) return false

  const maxTier = pack.chain.length - 1
  return candidate.cells.every((cell) => {
    if (cell === null) return true
    return (
      typeof cell.instanceId === 'string' &&
      typeof cell.tierIndex === 'number' &&
      cell.tierIndex >= 0 &&
      cell.tierIndex <= maxTier
    )
  })
}
