"use client"
import React,{useState} from 'react'
import Link from 'next/link';
import { auth } from '@/app/FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';


const Profile = () => {


  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () =>{
    if(password == newPassword){
    sendPasswordResetEmail(auth, email);
    } else {
      alert("Sifre se ne poklapaju")
    }
  }


  return (
    <div className='w-full h-screen'>
      <h1 className='text-4xl'>Postavke profila</h1>
     
      <div className='flex flex-col justify-start items-start mt-20'>
          <label>Promijenite Vas e-mail</label>
          <input 
          type="email" 
          required 
          placeholder='Unesite Vaš mail' 
          className='w-[50%] py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]'
          onChange={(e)=>setEmail(e.target.value)}
          /> 
          <button className='px-4 py-2 bg-red-400 rounded-full mt-5'>Promijeni</button>

          <label className='mt-10'>Unesite novu sifru</label>
          <input 
          type="password" 
          required 
          placeholder='Šifra' 
          className='w-[50%] mt-5 py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
          hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]'
          onChange={(e)=>setPassword(e.target.value)}
          /> 

          <br />
          <label>Potvrdite novu sifru</label>
          <input 
        type="password" 
        required 
        placeholder='Šifra' 
        className='w-[50%] mt-5 py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
        hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]'
        onChange={(e)=>setNewPassword(e.target.value)}
        /> 

        <button 
        className='px-4 py-2 bg-red-400 rounded-full mt-5'
        onClick={()=>changePassword()}
        >Promijeni</button>
      </div>
    </div>
  )
}

export default Profile