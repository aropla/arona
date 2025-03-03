import { defineComponent } from 'seele'

const idGen = () => crypto.randomUUID()

export const MiracleID = defineComponent(id => id || idGen(), 'MiracleID')
export const MiracleNodeID = defineComponent(id => id || idGen(), 'MiracleNodeID')
export const TravelerID = defineComponent(id => id || idGen(), 'TravelerID')
export const MemoID = defineComponent(id => id || idGen(), 'MemoID')
