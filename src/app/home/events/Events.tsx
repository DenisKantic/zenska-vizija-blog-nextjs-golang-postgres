'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
// firebase
import { collection, getDocs } from 'firebase/firestore'
// components
import EventCard from './EventCard'

const Events = () => {
  const [startIndex, setStartIndex] = useState(0)
  const [events, setEvents] = useState([])

  useEffect(() => {
    console.log('svi dogadjaji: ', events)
  }, [events])

  {
    /*pagination logic*/
  }
  const handleNextBlogs = () => {
    setStartIndex((prevIndex) => prevIndex + 4)
  }

  const handlePrevBlogs = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 4, 0))
  }

  const currentEvents = events.slice(startIndex, startIndex + 4)
  const currentPage = Math.floor(startIndex / 4) + 1
  const totalPages = Math.ceil(events.length / 4)

  return (
    <>
      <div
        id="events"
        className="flex items-center justify-center font-bold py-4 pt-5 lg:px-6 mt-12 text-chineseBlack"
      >
        <h1 className="lg:text-5xl sm:text-[22px] xxs:text-[24px] opacity-80">
          Skorašnji Događaji
        </h1>
      </div>
      <div
        className="flex items-center justify-center text-chineseBlack opacity-80 xxs:text-[12px]
      lg:text-xl md:text-[15px] sm:text-[14px] lg:pt-5 lg:pb-4 lg:px-6 lg:my-3 sm:px-9 sm:py-3 xxs:px-6 xxs:py-4"
      >
        <p className="xxs:text-center">
          Vrlo često organizujemo događaje na razne teme, jer brinemo o našim
          članicama
        </p>
      </div>
      <div
        className="flex lg:mt-4 flex-wrap lg:justify-end md:justify-center sm:justify-end items-center xxs:justify-center 
      mr-4 mb-2 lg:py-4 lg:px-5 sm:pr-2 sm:mt-5 xxs:my-4 md:pl-4"
      >
        <span
          className="text-chineseBlack lg:text-xl sm:text-[14px] lg:mr-4 lg:pt-2 lg:pr-4 
        md:mr-2 md:pr-2 md:mb-2 xxs:text-[12px] xxs:pb-1 xxs:px-2"
        >
          Vidi starije događaje
        </span>
        <div
          className="flex flex-wrap lg:space-x-2 xxs:space-x-2 sm:space-x-1 md:mb-2
        lg:mr-8 sm:pr-2 sm:pt-1 xxs:ml-3"
        >
          <div className="lg:px-2 xxs:pr-2">
            <Image
              className="hover:text-purplePizzazz lg:h-full lg:w-full md:h-[80%] md:w-[80%] 
              sm:h-[80%] sm:w-[80%] xxs:h-[80%] xxs:w-[90%] cursor-pointer"
              src="/images/landing/grayArrow.png"
              alt="grayArrow"
              width={100}
              height={100}
              onClick={handlePrevBlogs}
            />
          </div>
          <div className="lg:px-3">
            <Image
              className=" hover:text-grayy lg:h-full lg:w-full md:h-[80%] md:w-[80%] 
              sm:h-[80%] sm:w-[80%] xxs:h-[80%] xxs:w-[90%] cursor-pointer"
              src="/images/landing/pinkArrow.png"
              alt="pinkArrow"
              width={100}
              height={100}
              onClick={handleNextBlogs}
            />
          </div>
        </div>
      </div>
      <div
        className="flex lg:flex-row lg:justify-between xxs:justify-center xxs:flex-col md:justify-center sm:flex-col 
        md:flex-col lg:py-4 xxs:px-3 xxs:py-3 xxs:gap-3 md:gap-2 lg:px-6"
      >
        {currentEvents.map((event: any) => (
          <EventCard
            key={event.id}
            imageURL={event.data.imageURL}
            title={event.data.title}
            time={event.data.time}
            description={event.data.description}
            location={event.data.location}
            locationIcon="/images/landing/pink_location.png"
            clockIcon="/images/landing/pink_clock_icon.png"
            calendarIcon="/images/landing/pink_calendar_icon.png"
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <span className="text-chineseBlack mr-1 mt-1">
          {currentPage}/{totalPages}
        </span>
      </div>
    </>
  )
}

export default Events
