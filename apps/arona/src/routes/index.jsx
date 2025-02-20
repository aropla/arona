import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App'
import Arona from '../pages/arona/Arona/Arona'
import Miracles from '../pages/arona/Miracles/Miracles'
import Memos from '../pages/arona/Memos/Memos'
import TickTock from '../pages/arona/TickTock/TickTock'
import Toki from '../pages/toki/Toki/Toki'

export const Locations = {
  Root: '/',
  Arona: '/arona',
  AronaHome: '/arona/home',
  AronaMiracles: '/arona/miracles',
  AronaMemos: '/arona/memos',
  AronaTickTock: '/arona/tick-tock',
  Toki: '/arona/toki',
}

export const router = createBrowserRouter([
  {
    path: Locations.Root,
    element: <Navigate to="/arona" replace />,
  },
  {
    path: Locations.Arona,
    element: <App />,
    children: [
      {
        index: true,
        element: <Arona />,
      },
      {
        path: Locations.AronaMiracles,
        element: <Miracles />,
      },
      {
        path: Locations.AronaMemos,
        element: <Memos />,
      },
      {
        path: Locations.AronaTickTock,
        element: <TickTock />,
      },
      {
        path: Locations.Toki,
        element: <Toki />,
      }
    ]
  },
])
