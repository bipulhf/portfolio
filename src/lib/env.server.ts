import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  UPLOADTHING_TOKEN: z.string().min(1).optional(),
  SITE_URL: z.url(),
})

let cachedEnv: z.infer<typeof envSchema> | null = null
let cachedFileEnv: Record<string, string> | null = null

function parseEnvFile(filePath: string) {
  const values: Record<string, string> = {}

  if (!existsSync(filePath)) {
    return values
  }

  const content = readFileSync(filePath, 'utf8')

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line
    const separatorIndex = normalized.indexOf('=')

    if (separatorIndex <= 0) {
      continue
    }

    const key = normalized.slice(0, separatorIndex).trim()
    let value = normalized.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    values[key] = value
  }

  return values
}

function getFileEnv() {
  if (cachedFileEnv) {
    return cachedFileEnv
  }

  const cwd = process.cwd()
  const envPaths = [
    path.resolve(cwd, '.env'),
    path.resolve(cwd, '.env.local'),
  ]

  cachedFileEnv = envPaths.reduce<Record<string, string>>((accumulator, envPath) => {
    return {
      ...accumulator,
      ...parseEnvFile(envPath),
    }
  }, {})

  return cachedFileEnv
}

function resolveEnvValue(key: keyof z.infer<typeof envSchema>, fallback?: string) {
  const fileEnv = getFileEnv()
  return process.env[key] ?? fileEnv[key] ?? fallback
}

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  cachedEnv = envSchema.parse({
    DATABASE_URL: resolveEnvValue('DATABASE_URL'),
    SESSION_SECRET: resolveEnvValue('SESSION_SECRET'),
    UPLOADTHING_TOKEN: resolveEnvValue('UPLOADTHING_TOKEN'),
    SITE_URL: resolveEnvValue('SITE_URL', 'http://localhost:3000'),
  })

  return cachedEnv
}

export function getSiteUrl(pathname = '/') {
  const siteUrl = new URL(getEnv().SITE_URL)
  return new URL(pathname, siteUrl).toString()
}
