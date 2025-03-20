import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App'
import Arona from '@pages/arona/Arona/Arona'
import Miracles from '@pages/arona/Miracles/Miracles'
import Memos from '@pages/arona/Memos/Memos'
import TickTock from '@pages/arona/TickTock/TickTock'
import { MiracleCreatorStage } from '@pages/arona/Miracles/MiracleCreatorStage/MiracleCreatorStage'
import { MiracleEditorStage } from '@pages/arona/Miracles/MiracleEditorStage/MiracleEditorStage'

export const Locations = {
  Root: '/',
  Arona: '/arona',
  AronaHome: '/arona/home',
  AronaMiracles: '/arona/miracles',
  AronaMemos: '/arona/memos',
  AronaTickTock: '/arona/tick-tock',
  AronaMiracleCreator: '/arona/miracles/create',
  AronaMiracleEditor(id = ':id') {
    return `/arona/miracles/${id}/edit`
  },
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
        children: [
          {
            path: Locations.AronaMiracleEditor(),
            element: <MiracleEditorStage />,
          },
          {
            path: Locations.AronaMiracleCreator,
            element: <MiracleCreatorStage />,
          },
        ]
      },
      {
        path: Locations.AronaMemos,
        element: <Memos />,
      },
      {
        path: Locations.AronaTickTock,
        element: <TickTock />,
      },
    ]
  },
])
