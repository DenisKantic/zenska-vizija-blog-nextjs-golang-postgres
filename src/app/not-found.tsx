import Image from "next/image"
import Link from "next/link"

export default function notFound(){
    return(
         <div className='bg-[#FEF1FD] h-screen w-full text-center flex flex-col justify-center items-center'>
        <Image 
        src="/images/zenskaBG.png"
        height={400}
        width={400}
        alt='Zenska vizija logo'
        />
        <p className='text-xl text-center pt-10'>Greška 404. <br />
            Željena stranica nije pronađena.
        </p>
        <Link className="text-xl text-slate-600 underline pt-10" href="/">Klikni ovdje za povratak na početnu stranicu</Link>
    </div>
    )
}