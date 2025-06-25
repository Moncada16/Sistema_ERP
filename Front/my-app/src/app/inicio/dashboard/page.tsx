"use client"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"


export default function DashboardPage (){
     const { logout } = useAuth()
      const router = useRouter()

    const handleLogout = () => {
    logout()
    router.push('/login')
  }
    return(
        <div>
            <button onClick={handleLogout} className="bg-red-800 hover:bg-green-800 text-amber-300">Cerrar Sesion</button>
        </div>
    )
        

    }