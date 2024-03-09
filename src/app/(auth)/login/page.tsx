"use client"
import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/AuthContext";



const Login = () => {

  const router = useRouter();
  const { user, login } = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const checkUserState = () =>{
    if(user){
      router.push('/dashboard');
    } else {
      router.push('login');
    }
  }
  
  useEffect(()=>{
    checkUserState();
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    console.log(user);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.log("error u handle submit",error);
    }
  };


  return (
    <div 
    className='w-full bg-[#FEF1FD] min-h-screen flex justify-center items-center overflow-hidden
    xxs:flex-col lg:flex-row xxs:p-4 sm:p-10'>

    <div 
    className='flex h-[50vh] 
               xxs:h-[15vh] lg:hidden xxs:flex-col'>
        <Image 
        src="/images/zenskaBG.png"
        alt='zenska vizija logo'
        width={50}
        height={50}
        className='w-full h-full object-contain'
        unoptimized={true}
        />
    </div>

    <div
    className='mx-auto h-[50vh] flex flex-col overflow-hidden
    xxs:w-full xxs:h-full lg:w-[50%] sm:p-0 md:p-10'
    onSubmit={()=>handleSubmit}>
        <h1 
        className='text-[#AC009B] font-bold p-3
                  xxs:text-2xl sm:text-4xl'>
        Dobrodošli!
        </h1>

        <input 
        type="email" 
        required 
        value={email}
        placeholder='Unesite Vaš mail' 
        className='w-full mt-10 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
        hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]
        xxs:text-sm xxs:p-2 sm:p-7 sm:text-xl sm:py-3'
        onChange={(e)=>setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            handleSubmit(e);
          }}
        /> 

        <br />

        <input 
        type="password" 
        required 
        value={password}
        placeholder='Šifra' 
        className='w-full mt-5 py-3 p-7 text-[#C86DD7] text-xl rounded-full outline-none cursor-pointer
        hover:outline-1 hover:outline-[#F93EDF] focus:outline-[#AC009B]
        xxs:text-sm xxs:p-2 sm:p-7 sm:text-xl sm:py-3'
        onChange={(e)=>setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            handleSubmit(e);
          }}
        /> 

        <br />

        <a 
        href="#"
        className='text-[#C86DD7] italic underline
                  xxs:text-sm xxs:m-0 sm:text-lg sm:m-3'
        >Zaboravili ste šifru?</a>

        <div className='w-full mt-5 p-3 flex flex-row justify-between items-center'>
            <button
            className='w-[45%] bg-none border border-[2px] border-[#F93EDF] rounded-full py-2 text-[#F93EDF]
                       hover:bg-[#F93EDF] hover:text-white hover:font-bold
                      xxs:text-sm sm:text-lg'
            >
            Napusti
            </button>

            <button
            className='w-[45%] bg-[#F93EDF] text-white border border-[2px] border-[#F93EDF] rounded-full py-2 
                       hover:bg-transparent hover:border-[#F93EDF] hover:font-bold hover:text-[#F93EDF]
                       xxs:text-sm sm:text-lg'
                       type='submit'
                       onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleSubmit(e);
                        }}
            >
            Prijavi se
            </button>
        </div>

    </div>

    <div className='flex p-10 w-[50%] h-[50vh] xxs:hidden lg:block'>
        <Image 
        src="/images/zenskaBG.png"
        alt='zenska vizija logo'
        width={50}
        height={50}
        className='w-full h-full object-contain'
        unoptimized={true}
        />
    </div>

    </div>
  )
}

Login.requireAuth = true
export default Login