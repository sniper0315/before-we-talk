import { lazy } from 'react'

const DefaultSteps = lazy(() => import('../../views/defaultSteps'))

const DefaultStepsRoutes = [
  {
    path: '/defaultSteps',
    element: <DefaultSteps />
  }
]

export default DefaultStepsRoutes
