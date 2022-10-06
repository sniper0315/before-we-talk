import { lazy } from 'react'

const SavedFlows = lazy(() => import('../../views/savedFlows'))

const SavedFlowsRoutes = [
  {
    path: '/savedFlows',
    element: <SavedFlows />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  }

]

export default SavedFlowsRoutes
