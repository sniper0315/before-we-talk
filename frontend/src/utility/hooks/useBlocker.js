import * as React from 'react'
import { UNSAFE_NavigationContext } from 'react-router-dom'
// import { History, Transition } from 'history'

export const useBlocker = (blocker, when = true) => {
  const navigator = React.useContext(UNSAFE_NavigationContext)
    .navigator


      console.log('handleBlockedNavigation', blocker)
  React.useEffect(() => {
    if (!when) return

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock()
          tx.retry()
        }
      }
      blocker(autoUnblockingTx)
    })

    return unblock
  }, [navigator, blocker, when])
}
