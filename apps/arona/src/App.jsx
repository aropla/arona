import { Link, Outlet } from 'react-router'
import './App.css'
import Timeline from './components/Timeline/Timeline'
import Traveler from './components/Traveler/Travler'
import ViewPanel from './components/ViewPanel/ViewPanel'
import { Locations } from './routes'
import { travler } from './mocks'
import { useMouseRegistry } from '@hooks'
import arona from '@arona'

function App() {
  useMouseRegistry()

  return (
    <>
      <div className="app flex h-full">
        <LeftBar />

        <div className="main flex flex-col flex-1">
          <div className="top-padding h-6"></div>

          <ViewPanel className="flex-1">
            <Outlet />
          </ViewPanel>

          <div className="top-padding h-10"></div>
        </div>

        <RightBar />

        <div className="fixed left-10 bottom-10">
          <Traveler traveler={travler} />
        </div>
      </div>

      <Debuger />
    </>
  )
}

function Debuger() {
  const dehydration = arona.dehydrate()
  const { names, components } = dehydration.component

  const sortedNames = []

  for (let i = 1; i <= components.length; i++) {
    const index = components.indexOf(i)

    sortedNames.push(names[index])
  }

  return (
    <div className="debuger absolute top-4 right-4 rounded bg-white/10">
      {
        sortedNames.map((name, component) => (
          <div
            key={component + 1}
            className="flex justify-between p-2"
          >
            <div className="mr-10">{name}</div>
            <div>{component + 1}</div>
          </div>
        ))
      }
      <div className="components">

      </div>
    </div>
  )
}

export default App

function LeftBar() {
  return (
    <div className="left-bar w-90 pt-6 pl-10 shrink-0">
      <div className="menu flex flex-col ">
        <div className="menu">
          <Link to={Locations.Arona}>
            <div className="div rounded bg-white/20 h-12 w-24 flex items-center mr-4 pl-3 text-4">Arona</div>
          </Link>
        </div>

        <div className="menu mt-4 flex flex-col gap-y-4">
          <Link to={Locations.AronaMemos}>
            <div className="div rounded bg-white/20 h-12 w-24 flex items-center mr-4 pl-3 text-4">Memos</div>
          </Link>
          <Link to={Locations.AronaMiracles}>
            <div className="div rounded bg-white/20 h-12 w-24 flex items-center mr-4 pl-3 text-4">Miracles</div>
          </Link>
          <Link to={Locations.AronaTickTock}>
            <div className="div rounded bg-white/20 h-12 w-24 flex items-center mr-4 pl-3 text-4">TickTock</div>
          </Link>
          <Link to={Locations.Toki}>
            <div className="div rounded bg-white/20 h-12 w-24 flex items-center mr-4 pl-3 text-4">Toki</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function RightBar() {
  return (
    <div className="right-bar w-120 shrink-0"></div>
  )
}
