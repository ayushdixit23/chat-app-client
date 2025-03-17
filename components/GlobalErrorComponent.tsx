import { AlertTriangle } from 'lucide-react'

export default function GlobalErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] text-center p-6 bg-white dark:bg-[#0d0d0d] ">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-semibold text-red-600 mt-4">
        Oops! Something went wrong.
      </h2>
      <p className="text-gray-600 dark:text-white mt-2">
        An unexpected error has occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-all"
      >
        Try Again
      </button>
    </div>
  )
}
