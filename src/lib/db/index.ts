import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { getEnv } from '~/lib/env.server'
import * as schema from './schema'

const globalForDb = globalThis as typeof globalThis & {
  __portfolioPool?: Pool
}

function getPool() {
  if (!globalForDb.__portfolioPool) {
    globalForDb.__portfolioPool = new Pool({
      connectionString: getEnv().DATABASE_URL,
    })
  }

  return globalForDb.__portfolioPool
}

export const db = drizzle(getPool(), { schema })
