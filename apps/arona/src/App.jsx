import { Link, Outlet } from 'react-router'
import './App.css'
import Timeline from './components/Timeline/Timeline'
import Traveler from './components/Traveler/Travler'
import ViewPanel from './components/ViewPanel/ViewPanel'
import { Locations } from './routes'
import { travler } from './mocks'
import { useMouseRegistry } from '@hooks'


function LeftBar() {
  return (
    <div className="left-bar w-90 pt-5 pl-10 shrink-0">
      <div className="menu flex flex-col ">
        <div className="menu">
          <Link to={Locations.Arona}>
            <div className="div text-4">Arona</div>
          </Link>
        </div>

        <div className="menu mt-4 flex flex-col">
          <Link to={Locations.AronaMiracles}>
            <div className="div text-4">Miracles</div>
          </Link>
          <Link to={Locations.AronaMemos}>
            <div className="div text-4">Memos</div>
          </Link>
          <Link to={Locations.AronaTickTock}>
            <div className="div text-4">TickTock</div>
          </Link>
          <Link to={Locations.Toki}>
            <div className="div text-4">Toki</div>
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

function App() {
  useMouseRegistry()

  return (
    <>
      <div className="app flex h-full">
        <LeftBar />

        <div className="main flex flex-col flex-1">
          <ViewPanel>
            <Timeline />
          </ViewPanel>

          <ViewPanel className="flex-1">
            <Outlet />
          </ViewPanel>

          <ViewPanel className="h-40">

          </ViewPanel>
        </div>

        <RightBar />

        <div className="fixed left-10 bottom-10">
          <Traveler traveler={travler} />
        </div>
      </div>
    </>
  )
}

export default App
