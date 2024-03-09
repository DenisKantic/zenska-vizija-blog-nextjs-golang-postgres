"use client"
import React from 'react'
import UserDataFetcher from './Post';

const fetchData = () => {
  return (
    <div className='w-full h-screen overflow-y-scroll p-10'>
      <h1 className='text-4xl'>Moje objave</h1>

    <div className='w-full'>
      <UserDataFetcher />
    </div>

    </div>
  )
}

export default fetchData;