import React from 'react'

const ShimmerListChats = () => {
  return (
    <div className="overflow-y-auto flex-1">
    {[...Array(10)].map((_, index) => (
      <div
        key={index}
        className="flex items-center p-4 border-b animate-pulse"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700" />
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <div className="w-32 h-4 bg-gray-100 dark:bg-slate-700 rounded" />
            <div className="w-16 h-4 bg-gray-100 dark:bg-slate-700 rounded" />
          </div>
          <div className="flex justify-between mt-2">
            <div className="w-48 h-3 bg-gray-100 dark:bg-slate-700 rounded" />
            <div className="w-5 h-5 bg-gray-100 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default ShimmerListChats
