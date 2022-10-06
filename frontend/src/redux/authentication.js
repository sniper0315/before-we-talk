// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      state[config.storageTempStepKeyName] = action.payload[config.storageTempStepKeyName]
      
      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem(config.storageTokenKeyName, action.payload.accessToken)
      localStorage.setItem(config.storageRefreshTokenKeyName, action.payload.refreshToken)
      localStorage.setItem(config.storageTempStepKeyName, action.payload.tempStep)
    },
    handleLogout: state => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      state[config.storageTempStepKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
      localStorage.removeItem(config.storageTempStepKeyName)
    },
    handleSocketObject: (state, action) => {
      state[config.socketObject] = action.payload[config.socketObject]
      localStorage.setItem(config.socketObject, action.payload.socketObject)
    },
    handleClearTempStep: state => {
      state[config.storageTempStepKeyName] = null
      localStorage.removeItem(config.storageTempStepKeyName)
    },
    handleUpdateUser: (state, action) => {
      state.userData = action.payload
      localStorage.setItem('userData', JSON.stringify(action.payload))
    }
  }
})

export const { handleLogin, handleLogout, handleUpdateUser, handleClearTempStep, handleSocketObject } = authSlice.actions

export default authSlice.reducer
