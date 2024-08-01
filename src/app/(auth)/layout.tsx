import { FC, ReactNode } from 'react'
import { AuthProvider } from '../AuthContext'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}

export default AuthLayout
