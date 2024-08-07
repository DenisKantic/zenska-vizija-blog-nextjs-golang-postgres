'use server'
import React from 'react'
import UserDataFetcher from './Post'
import Spinner from '@/app/Spinner'

const FetchData = () => {
  return (
    <div
      className="w-full h-full overflow-y-scroll bg-white
                    xxs:p-5 md:p-10"
    >
      <h1 className="text-4xl pb-10 text-black focus:outline-none">Blog</h1>

      <div className="w-full min-h-[100svh] overflow-hidden">
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
