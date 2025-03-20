import { Link, Outlet } from 'react-router'
import './App.css'
import { TheTraveler } from '@pages/globalComponents'
import { AronaPanelView } from '@/components/AronaView/AronaPanelView/AronaPanelView'
import { Locations } from './routes'
import { useMouseRegistry } from '@hooks'
import { arona, useMe } from '@arona'
import { AronaButton } from '@/components/AronaButton/AronaButton'
import { AronaButtonGroup } from '@/components/AronaButton/AronaButtonGroup'
import { AronaPaimon } from '@/components/AronaPaimon/AronaPaimon'
import { useCallback } from 'react'

function App() {
  useMouseRegistry()

  const me = useMe()

  return (
    <>
      <div className="app flex h-full">
        <div className="fixed left-10 top-6">
          <LeftTopCorner />
        </div>

        <LeftBar />

        <div className="main flex flex-col flex-1 mt-6">
          <AronaPaimon />

          <AronaPanelView className="flex-1 mt-4">
            <Outlet />
          </AronaPanelView>
        </div>

        <RightBar />

        <div className="fixed left-10 bottom-10">
          <TheTraveler traveler={me} />
        </div>

        <div className="fixed top-6 right-10">
          <Navigator />
        </div>

        <div className="fixed bottom-10 right-10">
          <Skills />
        </div>
      </div>

      <div className="fixed right-10 top-30">
        <Debuger />
      </div>
    </>
  )
}

function LeftTopCorner() {
  return (
    <div className="left-top-cornor">
      <div className="minimap w-75 h-50 rounded bg-white/10">

      </div>
      <div className="current-memo mt-15">
        <div className="name rounded bg-white/10 py-2 px-2 text-4 font-100">当前进行中 Memo</div>
      </div>
    </div>
  )
}


function Skills() {
  const handleAronaSave = useCallback(() => {
    console.group('save')
    const dehydration = arona.dehydrate()

    const rawStr = JSON.stringify(dehydration, (key, value) => {
      if (key === '_gsap') {
        return
      }

      return value
    })

    localStorage.setItem('arona', rawStr)
    console.groupEnd('save')
  }, [])

  return (
    <div className="skills">
      <AronaButtonGroup className="space-x-6 color-white/60">
        <AronaButton className="w-15 h-15">
          Memo
        </AronaButton>
        <AronaButton className="w-15 h-15">
          Miracle
        </AronaButton>
        <AronaButton className="w-15 h-15 flex flex-col">
          <div className="span">Miracle</div>
          <div className="span">Node</div>
        </AronaButton>

        <AronaButton className="w-15 h-15 flex flex-col" onClick={handleAronaSave}>
          Save
        </AronaButton>
      </AronaButtonGroup>
    </div>
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
    <div className="debuger rounded bg-white/10">
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

function Navigator() {
  return (
    <div className="navigator h-20">
      <div className="menu flex space-x-6">
        <Link to={Locations.Arona}>
          <div className="rounded bg-white/20 h-15 w-15 flex justify-center items-center text-3">Arona</div>
        </Link>
        <Link to={Locations.AronaMemos}>
          <div className="rounded bg-white/20 h-15 w-15 flex justify-center items-center text-3">Memos</div>
        </Link>
        <Link to={Locations.AronaMiracles}>
          <div className="rounded bg-white/20 h-15 w-15 flex justify-center items-center text-3">Miracles</div>
        </Link>
        <Link to={Locations.AronaTickTock}>
          <div className="rounded bg-white/20 h-15 w-15 flex justify-center items-center text-3">TickTock</div>
        </Link>
        <Link to={Locations.Toki}>
          <div className="rounded bg-white/20 h-15 w-15 flex justify-center items-center text-3">Toki</div>
        </Link>
      </div>
    </div>
  )
}

function LeftBar() {
  return (
    <div className="left-bar w-90 pt-6 pl-10 shrink-0"></div>
  )
}

function RightBar() {
  return (
    <div className="right-bar w-120 shrink-0"></div>
  )
}
