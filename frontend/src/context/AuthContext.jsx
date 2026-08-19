import { createContext, useState, useContext } from 'react'
import { getUser, setAuth, clearAuth } from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser())

  const login = (token, userData) => {
    setAuth(token, userData)
    setUser(userData)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  const role = user?.role || null

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
export default AuthContext
