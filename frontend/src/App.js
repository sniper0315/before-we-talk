import React, { Suspense, useEffect } from 'react'
import { socket } from './utils/helper'
import { handleSocketObject } from '@store/authentication'
import { useDispatch } from 'react-redux'

// ** Router Import
import Router from './router/Router'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const data = { socketObject: socket }
    dispatch(handleSocketObject(data))
    // socket.on('sssss', data => {
    //   console.log(data)
    // })
  }, [socket])

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
