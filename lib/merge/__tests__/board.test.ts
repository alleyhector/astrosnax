import {
  applyDrop,
  createStarterBoard,
  findEmptyCell,
  spawnLowestTier,
} from '../board'
import { activeMergePack, maxTierIndex } from '../pack'

describe('merge board', () => {
  it('merges two matching tiers into the next tier', () => {
    const board = createStarterBoard(activeMergePack)
    // Starter places Sparks at (1,1) and (1,2)
    const from = 1 * board.cols + 1
    const to = 1 * board.cols + 2

    const result = applyDrop(board, from, to, maxTierIndex(activeMergePack))

    expect(result.didChange).toBe(true)
    expect(result.merged).toBe(true)
    expect(result.board.cells[from]).toBeNull()
    expect(result.board.cells[to]?.tierIndex).toBe(1)
  })

  it('moves onto an empty cell', () => {
    const board = createStarterBoard(activeMergePack)
    const from = 1 * board.cols + 1
    const empty = findEmptyCell(board)
    expect(empty).not.toBeNull()

    const result = applyDrop(
      board,
      from,
      empty as number,
      maxTierIndex(activeMergePack),
    )

    expect(result.didChange).toBe(true)
    expect(result.merged).toBe(false)
    expect(result.board.cells[from]).toBeNull()
    expect(result.board.cells[empty as number]?.tierIndex).toBe(0)
  })

  it('spawns a lowest-tier piece into an empty cell', () => {
    const board = createStarterBoard(activeMergePack)
    const beforeEmpty = findEmptyCell(board)
    const next = spawnLowestTier(board)

    expect(beforeEmpty).not.toBeNull()
    expect(next.cells[beforeEmpty as number]?.tierIndex).toBe(0)
  })
})
