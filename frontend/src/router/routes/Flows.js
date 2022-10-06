import { lazy } from 'react'

const Flows = lazy(() => import('../../views/flows'))

const FlowRoutes = [
  {
    path: '/flows',
    element: <Flows />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  },
  {
    path: '/flows/:flowId',
    element: <Flows />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  },
  {
    path: '/confirm/:confirmCode',
    element: <Flows />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  }
]

export default FlowRoutes
