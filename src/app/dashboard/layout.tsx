import Navbar from './navigation/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#FEF1FD] h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="p-5 flex-none">
        <Navbar />
      </div>
      <div className="flex p-5 w-full overflow-hidden">{children}</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        hideProgressBar={true}
      />
    </div>
  )
}
