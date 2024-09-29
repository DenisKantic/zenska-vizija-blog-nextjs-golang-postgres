'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaRegUser } from 'react-icons/fa6'
import { IoCreate } from 'react-icons/io5'
import { FaFileAlt } from 'react-icons/fa'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { CiLogout } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import { FaHome } from 'react-icons/fa'
import { useAuth } from '@/app/AuthContext'

const Navbar = () => {
  const { logout } = useAuth()
  const router = useRouter()

  const [nav, setNav] = useState(false)

  return (
    <div>
      {/* Top Menu (Hamburger for Mobile) */}
      <div className="md:hidden flex justify-between items-center bg-white p-5 shadow-md">
        <Image
          src="/images/zenskaBG.png"
          alt="zenska vizija logo"
          width={30}
          height={30}
          className="object-contain cursor-pointer"
          unoptimized
        />
        {/* Hamburger Icon for Mobile */}
        <button onClick={() => setNav(!nav)} className="text-3xl z-30">
          {nav ? <IoIosCloseCircleOutline /> : <FaHome />}
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        className={`${
          nav ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static z-20 top-0 left-0 h-[95vh] w-[300px] bg-white shadow-md flex flex-col justify-start items-center rounded-xl text-black p-5 transition-transform duration-300 ease-in-out md:translate-x-0 md:flex`}
      >
        <div className="w-full">
          <div
            className={
              nav
                ? 'flex flex-row items-center justify-center w-full mb-20'
                : 'flex flex-row items-center justify-between w-full mb-20'
            }
          >
            <Image
              src="/images/zenskaBG.png"
              alt="zenska vizija logo"
              width={30}
              height={30}
              className={
                nav
                  ? 'w-full mx-auto h-full mt-5 object-contain cursor-pointer'
                  : 'w-[50%] h-full object-contain mt-5'
              }
              unoptimized
            />

            <IoIosCloseCircleOutline
              onClick={() => setNav(false)}
              className={nav ? 'text-4xl cursor-pointer md:hidden' : 'hidden'}
            />
          </div>

          <div className="w-full">
            <Link
              href="/"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start text-xl cursor-pointer hover:text-red-400"
            >
              <FaHome />
              <p className={nav ? 'pl-10' : 'pl-10'}>Naslovna</p>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start text-xl cursor-pointer hover:text-red-400 pt-7"
            >
              <FaRegUser />
              <p className={nav ? 'pl-10' : 'pl-10'}>Dashboard</p>
            </Link>

            <Link
              href="/dashboard/createBlogPost"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
            >
              <IoCreate />
              <p className={nav ? 'pl-10' : 'pl-10'}>Kreiraj blog</p>
            </Link>

            <Link
              href="/dashboard/createEventPost"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
            >
              <IoCreate />
              <p className={nav ? 'pl-10' : 'pl-10'}>Kreiraj događaj</p>
            </Link>

            <Link
              href="/dashboard/blog"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
            >
              <FaFileAlt />
              <p className={nav ? 'pl-10' : 'pl-10'}>Moje objave</p>
            </Link>

            <Link
              href="/dashboard/event"
              onClick={() => setNav(false)}
              className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
            >
              <FaFileAlt />
              <p className={nav ? 'pl-10' : 'pl-10'}>Moji događaji</p>
            </Link>

            <Link
              href="/login"
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className="flex flex-row items-center pt-7 text-xl cursor-pointer hover:text-red-400"
            >
              <CiLogout />
              <p className={nav ? 'pl-10' : 'pl-10'}>Odjavi se</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
