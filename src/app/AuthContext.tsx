'use client'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import axios from 'axios'

interface AuthContextType {
  isAuthenticated: boolean
  login: (formData: FormData) => Promise<void>
  register: (formData: FormData) => Promise<void>
  logout: () => Promise<void>
}

// default value for context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const response = await axios.post()
      } catch (error) {}
    }
    checkAuth()
  }, [])

  const register = async (formData: FormData) => {
    try {
      const response = await axios.post(
        'https://www.zenska-vizija.ba/api/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )
      return response.status
    } catch (error: any) {
      console.log('error registering user', error)
      return error.response?.status || 500
    }
  }

  const login = async (formData: FormData): Promise<void> => {
    console.log('SENT FORM DATA', formData)

    try {
      const response = await axios.post(
        'https://www.zenska-vizija.ba/api/login',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setIsAuthenticated(true)
        router.push('/dashboard')
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    } catch (error: any) {
      setIsAuthenticated(false)
      return error.response?.status || 500
    }
  }

  const logout = async () => {
    try {
      await axios.post('https://www.zenska-vizija.ba/api/logout', null, {
        withCredentials: true,
      })
      setIsAuthenticated(false)
    } catch (error) {
      console.log('error logging out', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an authprovider')
  }
  return context
}
