export type MergeShape = 'circle' | 'rounded'

export type MergeTier = {
  id: string
  name: string
  color: string
  shape: MergeShape
}

export type MergePack = {
  id: string
  name: string
  board: {
    cols: number
    rows: number
  }
  chain: MergeTier[]
}

export type BoardItem = {
  /** Stable instance id for React keys / drag tracking */
  instanceId: string
  /** Index into the pack chain (0 = lowest tier) */
  tierIndex: number
}

export type BoardCell = BoardItem | null

export type BoardState = {
  packId: string
  cols: number
  rows: number
  cells: BoardCell[]
}
