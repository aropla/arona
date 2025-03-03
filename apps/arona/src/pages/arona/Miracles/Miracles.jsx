import { MiracleID, Selfie, Profile } from '@arona/components'
import { useState } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import AronaScrollView from '@/components/AronaView/AronaScrollView/AronaScrollView'
import MiracleEditor from './components/MiracleEditor'
import { MiraclesQuery } from '@arona/queries'
import { useSeeleQuery } from '@app/seele-react'
import { useEffect } from 'react'
import { Miracle } from './components/Miracle'
import { AronaButtonGroup } from '@/components/AronaButton/AronaButtonGroup'
import { AronaButton } from '@/components/AronaButton/AronaButton'

export default function Miracles() {
  const miraclesQuery = useSeeleQuery(MiraclesQuery)

  const miracles = miraclesQuery.array()
  console.log('miraclesQuery', miracles[0])
  const [curMiracle, setCurMiracle] = useState(miracles[0])

  return (
    <div className="miracles flex flex-col h-full">
      <div className="padding-top h-20 mb-4 flex items-center rounded bg-white/10">
        <div className="selfie mx-2">
          <img
            className="w-15 h-15 rounded"
            src={curMiracle?.[Selfie].url}
          />
        </div>
        <div className="profile text-3.5">
          <div className="name">{curMiracle?.[Profile].name}</div>
        </div>
      </div>

      <MiracleEditor miracle={curMiracle} />
      <MiracleList miracles={miracles} curMiracle={curMiracle} setCurMiracle={setCurMiracle} />
    </div>
  )
}

function MiracleList({ miracles, setCurMiracle, curMiracle }) {
  const handleMiracleCreate = useCallback(() => {

  }, [])

  const handleMiracleRemove = useCallback(() => {

  }, [])

  return (
    <div className="miracle-list relative mt-4 rounded bg-white/10">
      <AronaScrollView className="flex-none">
        <div className="mt-3 ml-3 space-x-4 h-40 flex items-centerrounded">
          {
            curMiracle &&
            miracles.map(miracle => (
              <Miracle
                className="w-40"
                active={curMiracle[MiracleID] === miracle[MiracleID]}
                key={miracle[MiracleID]}
                miracle={miracle}
                setCurMiracle={setCurMiracle}
              />
            ))
          }
        </div>
      </AronaScrollView>

      <AronaButtonGroup className="absolute bottom-3 left-3">
        <AronaButton onClick={handleMiracleCreate}>+</AronaButton>
        <AronaButton onClick={handleMiracleRemove}>-</AronaButton>
      </AronaButtonGroup>
    </div>
  )
}
