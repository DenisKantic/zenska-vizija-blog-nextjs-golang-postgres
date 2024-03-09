"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/app/AuthContext";


const Dashboard = () => {

  const router = useRouter();
  const { user, logout } = useAuth();
  
  return (
    <div className='bg-[#FEF1FD] flex h-screen w-full'>
      {user ? (
      <div className='flex-1 p-5'>
        <h1 className='text-4xl'>Dobrodosli u svoj dashboard!</h1>
        <Link href="/dashboard/settings" className='px-4 py-3 bg-red-400 text-white font-bold'>Profile</Link>
        <p>Izaberite jednu od sljedecih opcija:</p>
        <button className='px-4 py-3 bg-red-400' onClick={()=>logout}>Odjava</button>
        </div>
        ) : ( <> {router.push('/login')}</> )}
       
    </div>
  )
}

export default Dashboard