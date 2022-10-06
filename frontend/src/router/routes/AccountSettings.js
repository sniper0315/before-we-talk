import { lazy } from 'react'

const AccountSettings = lazy(() => import('../../views/accountSettings'))

const AccountSettingRoutes = [
  {
    path: '/accountSettings',
    element: <AccountSettings />
  }
]

export default AccountSettingRoutes
