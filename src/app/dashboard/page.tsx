import Link from 'next/link'
import { useAuth } from '../AuthContext'

const Dashboard = async () => {
  return (
    <div className="bg-[#FEF1FD] flex h-full w-full overflow-y-scroll">
      <div className="flex-1 p-5 h-full">
        <h1 className="text-4xl">Dobrodošli u svoj dashboard!</h1>
        <p className="text-xl py-10">Izaberite jednu od sljedećih opcija:</p>
        <div
          className="w-[90%]  grid gap-10 pt-10 text-white font-bold tracking-wide text-3xl text-center 
                          xxs:grid-rows-2 xxs:h-auto md:grid-cols-2 md:h-[50vh]"
        >
          <Link
            href="/"
            className="w-full p-5 h-[200px] bg-red-400 flex justify-center items-center rounded-xl
                                    hover:bg-red-200 hover:text-red-600"
          >
            Nazad na početnu stranicu
          </Link>

          <Link
            href="/dashboard/createPost"
            className="w-full p-5 h-[200px] bg-blue-400 flex justify-center items-center rounded-xl
                      hover:bg-blue-200 hover:text-blue-500"
          >
            Kreiraj objavu
          </Link>

          <Link
            href="/dashboard/blog"
            className="w-full h-[200px] p-5 bg-orange-400 flex justify-center items-center rounded-xl
                        hover:bg-orange-200 hover:text-orange-500"
          >
            Moje objave
          </Link>

          <Link
            href="/dashboard/event"
            className="w-full h-[200px] p-5 bg-pink-400 flex justify-center items-center rounded-xl
                        hover:bg-pink-200 hover:text-pink-500"
          >
            Moji događaji
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
