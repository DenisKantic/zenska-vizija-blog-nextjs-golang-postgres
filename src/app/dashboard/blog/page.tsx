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
      <h1 className="text-4xl pb-10 text-black">Moje objave</h1>

      <div
        className="w-full min-h-[100svh] grid gap-10
      xxs:grid-cols-1 
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4"
      >
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
