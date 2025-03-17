import React from 'react'

export default function Loader() {
  return (
   <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-md z-50">
  <div className="flex flex-col items-center justify-center h-screen">
    {/* Spinner */}
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    
    {/* Loading Text */}
    <p className="mt-2 text-lg font-medium text-gray-700">Loading...</p>
  </div>
</div>

  )
}
