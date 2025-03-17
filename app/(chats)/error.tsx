'use client'

import GlobalErrorComponent from '@/components/GlobalErrorComponent'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <GlobalErrorComponent error={error} reset={reset}/>
  )
}
