import { Platform } from 'react-native'

export interface CacheStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  getCacheAge(key: string): Promise<number | null>
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
  const { createExpoFileSystemStorage } =
    require('redux-persist-expo-file-system-storage')
  const FileSystem = require('expo-file-system')

  const storage = createExpoFileSystemStorage({
    storagePath: `${FileSystem.documentDirectory}reduxPersist/`,
  })

  return {
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    getCacheAge: async (key) => {
      try {
        const fileUri = `${FileSystem.documentDirectory}reduxPersist/${key}`
        const fileInfo = await FileSystem.getInfoAsync(fileUri)

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
