/**
 * Health check endpoint para Docker healthcheck
 */
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
