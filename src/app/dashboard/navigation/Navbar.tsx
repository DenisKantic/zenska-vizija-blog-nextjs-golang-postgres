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
    <div
      className={
        nav
          ? 'h-[95vh] w-[100px] bg-white shadow-md flex flex-col justify-start items-center rounded-xl text-black p-1 xxs:hidden md:block'
          : 'h-[95vh] w-[300px] bg-white shadow-md flex flex-col justify-start items-center rounded-xl text-black p-5 xxs:hidden md:block'
      }
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
                ? ' w-full mx-auto h-full mt-5 object-contain cursor-pointer'
                : 'w-[50%] h-full object-contain mt-5'
            }
            unoptimized
            onClick={() => setNav(false)}
          />

          <IoIosCloseCircleOutline
            onClick={() => setNav(true)}
            className={nav ? 'hidden' : 'text-4xl cursor-pointer'}
          />
        </div>

        <div
          className={
            nav ? 'flex flex-col justify-center items-center' : 'w-full'
          }
        >
          <Link
            href="/"
            className="flex flex-row items-center justify-start text-xl cursor-pointer hover:text-red-400"
          >
            <FaHome />
            <p className={nav ? 'hidden' : 'pl-10'}>Naslovna</p>
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-row items-center justify-start text-xl cursor-pointer hover:text-red-400 pt-7"
          >
            <FaRegUser />
            <p className={nav ? 'hidden' : 'pl-10'}>Dashboard</p>
          </Link>

          <Link
            href="/dashboard/createBlogPost"
            className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
          >
            <IoCreate />
            <p className={nav ? 'hidden' : 'pl-10'}>Kreiraj objavu</p>
          </Link>

          <Link
            href="/dashboard/blog"
            className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
          >
            <FaFileAlt />
            <p className={nav ? 'hidden' : 'pl-10'}>Moje objave</p>
          </Link>

          <Link
            href="/dashboard/event"
            className="flex flex-row items-center justify-start pt-7 text-xl cursor-pointer hover:text-red-400"
          >
            <FaFileAlt />
            <p className={nav ? 'hidden' : 'pl-10'}>Moji događaji</p>
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
            <p className={nav ? 'hidden' : 'pl-10'}>Odjavi se</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
