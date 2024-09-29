import { useState } from 'react'
import Image from 'next/image'

import { dummyData } from './data/dummyData'

const CardSlider = () => {
  return (
    <div className="flex flex-col pb-10">
      <div className="flex mt-4 justify-end items-center mr-4 mb-4 py-6 px-5"></div>

      <div
        className="py-4 grid px-14 gap-10 mx-auto overflow-hidden
                      xxs:grid-cols-1 xxs:grid-rows-3 md:grid-cols-3 md:grid-rows-1 "
      >
        {dummyData.map((card, index) => (
          <div
            key={index}
            className=" bg-white shadow-lg rounded-xl flex flex-col items-center justify-center px-4"
          >
            <div className="flex justify-center items-center">
              <h2 className="text-2xl text-center font-bold opacity-60 py-6">
                {card.title}
              </h2>
            </div>
            <div className="flex-1 mb-2">
              <Image
                src={card.backgroundImage}
                alt={card.title}
                width={344}
                height={376}
                className="py-1 px-2 rounded-[16px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardSlider
