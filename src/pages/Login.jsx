import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState(null)
    const [loading, setLoading]   = useState(false)

    const { login, token } = useAuth()
    const navigate         = useNavigate()

    // Kalau sudah login → redirect ke home
    if (token) return <Navigate to="/" replace />

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response   = await api.post('/login', { email, password })
            const { data }   = response.data
            login(data.user, data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Login</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </div>
    )
}