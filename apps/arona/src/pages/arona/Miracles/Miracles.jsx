import Profile from '@arona/components/Profile'
import ID from '@arona/components/ID'
import { miracles } from '@/mocks'
import { useState } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import AronaScrollView from '@/components/AronaView/AronaScrollView/AronaScrollView'
import MiracleEditor from './components/MiracleEditor'

function MiracleList({ setCurMiracle, curMiracle }) {
  return (
    <AronaScrollView className="flex-none">
      <div className="miracle-list space-y-2 w-50 h-full">
        {
          miracles.map(miracle => (
            <Miracle
              active={curMiracle[ID] === miracle[ID]}
              key={miracle[ID]}
              miracle={miracle}
              setCurMiracle={setCurMiracle}
            />
          ))
        }
      </div>
    </AronaScrollView>
  )
}

function Miracle({ miracle = {}, setCurMiracle, active }) {
  const handleMiracleNodeClick = useCallback(() => {
    setCurMiracle(miracle)
  })

  return (
    <div
      className={
        classNames(
          "miracle h-20 py-1.75 px-3.5 rounded bg-white/25 ease-out duration-300 select-none",
          { 'text-blue-300 ': active }
        )
      }
      onClick={handleMiracleNodeClick}
    >
      <div className="profile">
        <div className="name text-4">{miracle[Profile]?.name}</div >
        <div className="desc text-3 text-white/50">{miracle[Profile]?.desc}</div>
      </div>
    </div >
  )
}

export default function Miracles() {
  const [curMiracle, setCurMiracle] = useState(miracles[0])

  return (
    <div className="miracles flex h-full">
      <MiracleList miracles={miracles} curMiracle={curMiracle} setCurMiracle={setCurMiracle} />
      <MiracleEditor miracle={curMiracle} />
    </div>
  )
}
