'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string>('')
  const [keyPresent, setKeyPresent] = useState<boolean>(false)

  useEffect(() => {
    const test = async () => {
      try {
        // Verificar variables de entorno
        const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setUrl(envUrl || 'NOT DEFINED')
        setKeyPresent(!!envKey)

        if (!envUrl || !envKey) {
          setError('❌ Environment variables not defined')
          setStatus('Failed')
          return
        }

        // Crear cliente
        const supabase = createClient()

        // Test simple: obtener usuario (debería retornar null si no hay sesión)
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          setError(`Error: ${error.message}`)
          setStatus('❌ Connection failed')
        } else {
          setStatus('✅ Connection successful!')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('❌ Test failed')
      }
    }

    test()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Supabase Connection Test</h1>

        <div className="space-y-4 rounded-lg bg-gray-800 p-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Status:</h2>
            <p className="text-2xl">{status}</p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Environment Variables:</h2>
            <div className="space-y-2 font-mono text-sm">
              <p>NEXT_PUBLIC_SUPABASE_URL:</p>
              <p className="rounded bg-gray-700 p-2">{url}</p>

              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
              <p className="rounded bg-gray-700 p-2">
                {keyPresent ? '✅ Defined (hidden for security)' : '❌ NOT DEFINED'}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-900/50 p-4">
              <h2 className="mb-2 text-xl font-semibold text-red-300">Error:</h2>
              <p className="font-mono text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="mt-6 rounded bg-blue-900/50 p-4">
            <h3 className="mb-2 font-semibold">If you see errors:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Make sure .env.local exists in the project root</li>
              <li>Restart the development server (Ctrl+C, then pnpm dev)</li>
              <li>Hard refresh the browser (Ctrl+Shift+R)</li>
              <li>Check Supabase dashboard for API settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
