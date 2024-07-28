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
      <h1 className="text-4xl">Moje objave</h1>

      <div className="w-full">
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
