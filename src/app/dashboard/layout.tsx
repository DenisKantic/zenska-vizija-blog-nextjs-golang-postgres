import Navbar from "./navigation/Navbar";
import { AuthContextProvider } from "@/app/AuthContext";


export default function Layout({ children }: { children: React.ReactNode }) {

    return (
            <AuthContextProvider>
        <div className="flex bg-[#FEF1FD] h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="p-5 flex-none">
            <Navbar />
            </div>
          <div className="flex p-5 w-full overflow-hidden">
            {children}
            </div>
        </div>
            </AuthContextProvider>
      );
    }