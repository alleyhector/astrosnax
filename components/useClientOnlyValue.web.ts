import { useSyncExternalStore } from 'react'

export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  return isClient ? client : server
}
