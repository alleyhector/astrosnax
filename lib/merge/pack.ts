import astrologyMerge from '@/content/packs/astrology-merge.json'
import type { MergePack, MergeTier } from './types'

export const activeMergePack: MergePack = astrologyMerge as MergePack

export function getTier(
  pack: MergePack,
  tierIndex: number,
): MergeTier | undefined {
  return pack.chain[tierIndex]
}

export function maxTierIndex(pack: MergePack): number {
  return pack.chain.length - 1
}
