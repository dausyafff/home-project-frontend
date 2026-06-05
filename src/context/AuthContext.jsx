import { createContext, useContext, useState } from 'react'

// 1. Buat "papan pengumuman"
const AuthContext = createContext()

// 2. Provider — pembungkus yang menyediakan data ke semua component di dalamnya
export function AuthProvider({ children }) {
    // restore dari localStorage saat pertama load
    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    )
    const [user, setUser]   = useState(
        JSON.parse(localStorage.getItem('user')) || null
    )

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('token', userToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
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