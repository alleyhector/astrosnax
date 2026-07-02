import * as FileSystem from 'expo-file-system/legacy'
import { Platform } from 'react-native'

export interface CacheStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  getCacheAge(key: string): Promise<number | null>
}

const CACHE_DIR = `${FileSystem.documentDirectory}reduxPersist/`
let initPromise: Promise<void> | null = null

function pathForKey(key: string) {
  const fileName = key.replace(/[^a-z0-9.\-_]/gi, '-')
  return `${CACHE_DIR}${fileName}`
}

async function ensureCacheDir() {
  if (!initPromise) {
    initPromise = (async () => {
      const info = await FileSystem.getInfoAsync(CACHE_DIR)
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
      }
    })()
  }

  await initPromise
}

function createWebCacheStorage(): CacheStorage {
  return {
    getItem: async (key) => {
      if (typeof localStorage === 'undefined') return null
      return localStorage.getItem(key)
    },
    setItem: async (key, value) => {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(key, value)
      localStorage.setItem(`${key}__ts`, String(Date.now()))
    },
    getCacheAge: async (key) => {
      if (typeof localStorage === 'undefined') return null
      const ts = localStorage.getItem(`${key}__ts`)
      if (!ts) return null
      return Date.now() - Number(ts)
    },
  }
}

function createNativeCacheStorage(): CacheStorage {
  return {
    getItem: async (key) => {
      await ensureCacheDir()

      try {
        const content = await FileSystem.readAsStringAsync(pathForKey(key), {
          encoding: FileSystem.EncodingType.UTF8,
        })
        return content || null
      } catch {
        return null
      }
    },
    setItem: async (key, value) => {
      await ensureCacheDir()
      await FileSystem.writeAsStringAsync(pathForKey(key), value, {
        encoding: FileSystem.EncodingType.UTF8,
      })
    },
    getCacheAge: async (key) => {
      await ensureCacheDir()

      try {
        const fileInfo = await FileSystem.getInfoAsync(pathForKey(key))

        if (fileInfo.exists && fileInfo.modificationTime) {
          return Date.now() - fileInfo.modificationTime * 1000
        }
        return null
      } catch (error) {
        console.error('Error checking cache age:', error)
        return null
      }
    },
  }
}

export const cacheStorage: CacheStorage =
  Platform.OS === 'web' ? createWebCacheStorage() : createNativeCacheStorage()
