import { Selfie, Profile } from '@arona/components'
import classNames from 'classnames'

export function TheTravelerSelfie({ className, traveler }) {
  return (
    <div className={classNames("selfie flex", className)}>
      <img
        src={traveler?.[Selfie].url}
        alt={traveler?.[Profile]?.name}
        className="box-border w-12 w-12 rounded-full border-solid border-2 border-white"
      />
    </div>
  )
}
