'use server'
import React from 'react'
import UserDataFetcher from './Post'
import Spinner from '@/app/Spinner'
import Navigation from '../navigation/Navbar'

const FetchData = () => {
  return (
    <div
      className="w-full h-full overflow-y-scroll bg-[#FEF1FD] 
                    xxs:p-5 md:p-10"
    >
      <Navigation />
      <h1 className="text-4xl pb-10 text-black text-center focus:outline-none mt-28">
        Blog
      </h1>

      <div className="w-full min-h-[100svh] overflow-hidden xs:px-5 md:px-10">
        <UserDataFetcher />
      </div>
    </div>
  )
}

export default FetchData
