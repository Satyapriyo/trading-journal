import React from 'react'
import { Button } from './ui/button'

const Topbar = () => {
  return (
    <div className='max-w-[50vw] mx-auto mt-[5vh] rounded-full px-10 shadow-2xl h-16 bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-gray-700 flex items-center '>
      <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>Trade Journaling</h1>
      <div className='ml-auto'>
        <Button variant='outline' className='mr-4 rounded-full px-5 border-blue-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-800'>Login</Button>
        <Button className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 font-bold'>Sign Up</Button>

      </div>

    </div>
  )
}

export default Topbar