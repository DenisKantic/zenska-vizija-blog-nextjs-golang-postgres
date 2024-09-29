'use server'
import React from 'react'
import UserDataFetcher from './Post'
import Spinner from '@/app/Spinner'
import Navbar from '../navigation/Navbar'

const FetchData = () => {
  return (
    <div
      className="w-full h-full overflow-y-scroll bg-[#FEF1FD] 
                    xxs:p-5 md:p-10"
    >
      <Navbar />
      <h1 className="text-4xl pb-10 text-black text-center focus:outline-none mt-28">
        Moji događaji
      </h1>

      <div className="w-full min-h-[100svh] xs:px-5 md:px-10 overflow-hidden">
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
