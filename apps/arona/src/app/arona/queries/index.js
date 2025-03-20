import { defineQuery } from 'seele'
import { Mine } from '@arona/components'
import { Miracle, MiracleNode, Memo, Traveler } from '@arona/entities'

export const MiraclesQuery = defineQuery(q => q.entity(Miracle))
export const MiracleNodesQuery = defineQuery(q => q.entity(MiracleNode))

export const MemosQuery = defineQuery(q => q.entity(Memo))

export const TravelersQuery = defineQuery(q => q.entity(Traveler))
export const MeQuery = defineQuery(q => q
  .every(Mine)
  .entity(Traveler)
  .single()
)
