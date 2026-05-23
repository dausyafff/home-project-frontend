import { createContext, useContext, useState } from 'react'

// 1. Buat "papan pengumuman"
const AuthContext = createContext()

// 2. Provider — pembungkus yang menyediakan data ke semua component di dalamnya
export function AuthProvider({ children }) {
    const [user, setUser]   = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('token', userToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. Hook — cara mudah mengakses context dari component manapun
export function useAuth() {
    return useContext(AuthContext)
}