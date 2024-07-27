import React from 'react'
import Image from 'next/image'

const spinner = () => {
  return (
    <div className='w-full h-screen bg-[#FEF1FD] flex justify-center items-center flex-col'>
           <Image 
              className='animate-pulse transform transition-transform duration-500 animate-zoom'
              src="/images/zenskaBG.png"
              height={300}
              width={300}
              alt='Zenska vizija logo'
           />
    </div>
  )
}

export default spinner