import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate       = useNavigate()
    const { login }      = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        const name  = searchParams.get('name')
        const email = searchParams.get('email')
        const error = searchParams.get('error')

        if (error) {
            navigate('/login?error=oauth_failed')
            return
        }

        if (token && name && email) {
            // Simpan token dan data user ke context + localStorage
            login({ name, email }, token)
            navigate('/')
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Memproses login Google...</p>
            </div>
        </div>
    )
}