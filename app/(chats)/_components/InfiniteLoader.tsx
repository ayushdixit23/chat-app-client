import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const InfiniteLoader = () => {
  return (
    <div className="flex justify-center items-center">
    <div className="animate-spin text-2xl my-2"><AiOutlineLoading3Quarters /></div>
  </div>
  )
}

export default InfiniteLoader