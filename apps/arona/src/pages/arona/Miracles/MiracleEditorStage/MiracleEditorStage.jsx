import { useParams } from "react-router"
import { MiracleEditor } from "../MiracleEditor/MiracleEditor"
import { arona } from '@arona'

export function MiracleEditorStage() {
  const params = useParams()
  const miracle = arona.miracle.get(params.id)

  return (
    <div className="miracle-editor-stage flex flex-1">
      <MiracleEditor miracle={miracle} />
    </div>
  )
}
