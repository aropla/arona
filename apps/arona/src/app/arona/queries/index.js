import { defineQuery } from 'seele'
import Miracle from '@arona/entities/Miracle'

export const MiraclesQuery = defineQuery(q => q.entity(Miracle))
