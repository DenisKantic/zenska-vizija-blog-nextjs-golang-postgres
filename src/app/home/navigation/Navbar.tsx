'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
const Navbar = ({ showAside }: any) => {
  const router = useRouter()
  const scrollTo = (route: any) => {
    const element = document.getElementById(`${route}`)
    if (element)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
  }
  return (
    <div className="fixed z-40 w-[92%] py-3 shadow-xl bg-[#fff] top-16 transform -translate-x-1/2 -translate-y-1/2 left-1/2 rounded-[16px]">
      <div className="flex justify-between items-center h-full w-full px-6 2xl:px-16">
        <div className="ml-4">
          <Link href="/dashboard">
            <Image
              src="/images/zenskaBG.png"
              alt="logo"
              width={110}
              height={110}
              className="md:px-3 md:ml-4 cursor-pointer"
              priority
            />
          </Link>
        </div>
        <div>
          <div className="md:hidden cursor-pointer" onClick={() => showAside()}>
            <HiOutlineMenuAlt3 size={24} color="#97427B" />
          </div>

          <ul className="hidden md:flex mr-12 lg:gap-4 ">
            <li
              onClick={() => scrollTo('home')}
              className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              <a className="text-[16px]">Početna</a>
            </li>

            <li
              onClick={() => scrollTo('aboutUs')}
              className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              <a className="text-[16px]">O nama</a>
            </li>

            <li
              onClick={() => scrollTo('events')}
              className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              <a className="text-[16px]">Događaji</a>
            </li>

            <Link
              href="/home/blog"
              className="cursor-pointer text-[16px] hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              Blog
            </Link>

            <li
              onClick={() => scrollTo('gallery')}
              className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              <a className="text-[16px]">Galerija</a>
            </li>

            <li
              onClick={() => scrollTo('contact')}
              className="cursor-pointer hover:bg-crayola hover:text-white rounded-[16px] px-5 py-3"
            >
              <a className="text-[16px]">Kontaktiraj nas</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
