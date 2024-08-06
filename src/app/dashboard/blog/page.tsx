'use server'
import React from 'react'
import UserDataFetcher from './Post'
import Spinner from '@/app/Spinner'

const FetchData = () => {
  return (
    <div
      className="w-full h-full overflow-y-scroll
                    xxs:p-0 md:p-10"
    >
      <h1 className="text-4xl pb-10 text-black focus:outline-none">
        Moje objave
      </h1>

      <div className="w-full min-h-[100svh] overflow-hidden">
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
