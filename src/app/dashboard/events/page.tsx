"use client"
import React from 'react'
import Event from './Events'

const Events = () => {
  return (
    <div className='w-full h-screen overflow-y-scroll p-10'>
    <h1 className='text-4xl'>Moji događaji</h1>

  <div className='w-full'>
    <Event />
    
  </div>
  </div>
)
}

export default Events