import { useMemo } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export function AronaTime({ className, time, empty = '' }) {
  const nTime = useMemo(() => dayjs(time), [time])

  return (
    <div className={classNames("arona-time", className)}>
      {
        time === undefined ? empty : nTime.format('YYYY.MM.DD HH:mm dddd')
      }
    </div>
  )
}

export function AronaTimeFromNow({ className, time }) {
  const nTime = useMemo(() => dayjs(time), [time])

  return (
    <div className={classNames("arona-time-from-now", className)}>{dayjs(nTime).fromNow()}</div>
  )
}
