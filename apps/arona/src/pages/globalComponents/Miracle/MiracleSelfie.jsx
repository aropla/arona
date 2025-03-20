import { Selfie, Profile } from '@arona/components'
import classNames from 'classnames'

export const MIRACLE_SELFIE_SIZE = {
  SMALL: 'w-15 h-15',
  LARGE: 'w-30 h-30',
  FULL: 'w-full h-full',
}

export function TheMiracleSelfie({ className, miracle, size = MIRACLE_SELFIE_SIZE.SMALL }) {
  const selfie = miracle?.[Selfie]
  const isImage = selfie && selfie.url !== ''

  return (
    <div className={classNames("selfie flex box-border", className, size)}>
      {
        isImage ? (
          <img
            src={miracle?.[Selfie].url}
            alt={miracle?.[Selfie].alt || miracle?.[Profile].name}
            className={classNames("rounded w-full h-full")}
          />
        ) : (
          <div
            className="
              text-viewport box-border overflow-hidden
              w-full h-full border-8 border-solid border-color-transparent
              flex justify-center items-center
              opacity-20
            "
          >
            <div className="text text-15">{miracle?.[Profile]?.name[0] || 'A'}</div>
          </div>
        )
      }
    </div>
  )
}
