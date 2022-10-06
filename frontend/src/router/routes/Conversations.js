import { lazy } from 'react'

const Conversations = lazy(() => import('../../views/conversations'))

const ConversationRoutes = [
  {
    path: '/conversations',
    element: <Conversations />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  },
  {
    path: '/conversations/:flowId',
    element: <Conversations />,
    meta: {
      publicRoute: true,
      restricted: false
    }
  }
]

export default ConversationRoutes
