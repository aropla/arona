import { defineQuery } from 'seele'
import { Miracle, MiracleNode, Memo } from '@arona/entities'

export const MiraclesQuery = defineQuery(q => q.entity(Miracle))
export const MiracleNodesQuery = defineQuery(q => q.entity(MiracleNode))

export const MemosQuery = defineQuery(q => q.entity(Memo))
