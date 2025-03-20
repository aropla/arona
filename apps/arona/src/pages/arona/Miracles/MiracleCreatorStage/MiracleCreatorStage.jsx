import { useCallback } from 'react'
import { useState } from 'react'
import { AronaForm, AronaFormItem, AronaInput } from '@/components/AronaInteraction/AronaInteraction'
import { useAronaForm } from '@/components/AronaInteraction/controller'
import { TheMiracle } from '@pages/globalComponents'
import { AronaButton } from '@/components/AronaButton/AronaButton'
import { Profile, MiracleID, MiracleRef, MiracleNodeRef, MiracleNodeID } from '@arona/components'
import { Miracle, MiracleNode } from '@arona/entities'
import { arona } from '@arona'

export function MiracleCreatorStage({ onCreate }) {
  const [rawMiracle, setRawMiracle] = useState({
    [Profile]: {
      name: '',
      desc: '',
    },
  })
  const form = useAronaForm(rawMiracle)

  const onCreateMiracle = useCallback(() => {
    const rawEntity = form.get()

    const miracle = arona.createEntity(Miracle, rawEntity)
    const miracleNode = arona.createEntity(MiracleNode, {
      [MiracleRef]: miracle[MiracleID],
      [Profile]: {
        name: miracle[Profile].name,
        desc: miracle[Profile].desc,
      },
    })

    miracleNode[MiracleNodeRef] = miracleNode[MiracleNodeID]

    form.clear()
    setRawMiracle({
      [Profile]: {
        name: '',
        desc: '',
      },
    })
  }, [onCreate])

  const handleMiracleNameChange = useCallback(value => {
    setRawMiracle({
      [Profile]: {
        name: value,
        desc: rawMiracle[Profile].desc,
      }
    })
  }, [rawMiracle])

  const handleMiracleDescChange = useCallback(value => {
    setRawMiracle({
      [Profile]: {
        name: rawMiracle[Profile].name,
        desc: value,
      }
    })
  }, [rawMiracle])

  return (
    <div className="miracle-creator flex flex-1 p-4">
      <div className="center-part w-60% flex items-center justify-center">
        <TheMiracle miracle={rawMiracle} />
      </div>

      <div className="right-part flex-1 flex flex-col justify-center">
        <AronaForm controller={form} className="w-100">
          <div className="title relative p-2 mb-8">
            <div className="bg absolute z--1 inset-0 top-50% bg-black/80 rounded"></div>
            <div className="text text-12 ml--2">新的命途</div>
            <div className="desc text-3 mt-3 text-white/60">踏上崭新的旅程</div>
          </div>

          <div className="form-items space-y-8 ">
            <AronaFormItem name={[Profile, 'name']} onChange={handleMiracleNameChange}>
              <div className="name mb-2 text-4">标题</div>
              <AronaInput />
            </AronaFormItem>
            <AronaFormItem name={[Profile, 'desc']} onChange={handleMiracleDescChange}>
              <div className="name mb-2 text-4">描述</div>
              <AronaInput />
            </AronaFormItem>
          </div>
        </AronaForm>

        <AronaButton className="mt-8" onClick={onCreateMiracle}>+</AronaButton>
      </div>
    </div>
  )
}
