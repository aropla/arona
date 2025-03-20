import { MiracleID, Selfie, Profile } from '@arona/components'
import { useState } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import { AronaScrollView } from '@/components/AronaView/AronaScrollView/AronaScrollView'
import { MiracleEditor } from './MiracleEditor/MiracleEditor'
import { MiraclesQuery } from '@arona/queries'
import { useSeeleQuery } from '@app/seele-react'
import { useEffect } from 'react'
import { AronaButtonGroup } from '@/components/AronaButton/AronaButtonGroup'
import { AronaButton } from '@/components/AronaButton/AronaButton'
import { TheMiracle } from '@pages/globalComponents'
import { arona } from '@arona'
import { Miracle } from '@arona/entities'
import { AronaForm, AronaFormItem, AronaInput } from '@/components/AronaInteraction/AronaInteraction'
import { useAronaForm } from '@/components/AronaInteraction/controller'
import { Link, Outlet, useParams } from 'react-router'
import { Locations } from '@/routes'

export default function Miracles() {
  const [miracles] = useSeeleQuery(MiraclesQuery)

  const [selectedMiracle, setSelectedMiracle] = useState(miracles[0])

  const handleSelectMiracle = useCallback(miracle => {
    setSelectedMiracle(miracle)
  }, [])

  return (
    <div className="miracles flex-1 flex flex-col justify-between">
      <div className="rounded bg-white/5 flex-1 flex flex-col">
        <Outlet />
      </div>

      <div className="tools rounded bg-white/10 h-15 mt-4 flex space-x-4">
        <AronaButton className="w-15 h-15">Edit</AronaButton>
        <AronaButton className="w-15 h-15">Index</AronaButton>
      </div>

      <div className="bottom-bar my-4 p-4 rounded bg-white/10 flex ">
        <MiracleList miracles={miracles} selectedMiracle={selectedMiracle} onSelect={handleSelectMiracle} />
        <MiracleCreator className="ml-10" />
      </div>
    </div>
  )
}

export function MiracleCreator({ className, onClick }) {
  return (
    <Link to={Locations.AronaMiracleCreator}>
      <div className={classNames("miracle-creator", className)} onClick={onClick}>
        <div className="button w-30 h-30 rounded bg-white/10 relative select-none">
          <div className="mark-add text-6 font-600 absolute left-2 top-1">+</div>
        </div>
      </div>
    </Link>
  )
}

function MiracleList({ miracles, selectedMiracle, onSelect }) {
  return (
    <div className="miracle-list">
      <AronaScrollView axis="x">
        <div className="content flex space-x-10">
          {
            miracles.map(miracle => (
              <Link key={miracle[MiracleID]} to={Locations.AronaMiracleEditor(miracle[MiracleID])}>
                <TheMiracle
                  className={classNames({
                    "border-1 border-solid border-transparent": true,
                    'border-pink-200': miracle[MiracleID] === selectedMiracle[MiracleID],
                  })}
                  key={miracle[MiracleID]}
                  miracle={miracle}
                  onSelect={onSelect}
                />
              </Link>
            ))
          }
        </div>
      </AronaScrollView>
    </div>
  )
}



{/* <div className="list flex flex-col leading-10">
<div className="item">Miracle 属性详情</div>
<div className="item">- 基本信息编辑</div>
<div className="item">- 进阶信息：节点定时任务查看</div>
<div className="item">- 进阶信息：节点热度视图，未完成且访问过且长时间未再次访问的热度</div>
<div className="item">- 进阶信息：节点状态统计，已完成，未完成统计，推迟情况统计，完成情况统计</div>
</div> */}
