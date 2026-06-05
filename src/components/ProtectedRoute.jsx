import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { token } = useAuth()

    // Kalau tidak ada token → redirect ke login
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // Kalau ada token → tampilkan halaman yang diminta
    return children
}