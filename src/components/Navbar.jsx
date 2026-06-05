import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
    const { user, token, logout } = useAuth()

    const handleLogout = async () => {
        
        const konfirmasi = window.confirm('Apakah Anda yakin ingin logout?')
    if (!konfirmasi) return

        try {
            await api.post('/logout')
        } catch (e) {
            // tetap logout di frontend meski request gagal
        } finally {
            logout()
        }
    }

    return (
        <nav style={{
            padding: '1rem',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
        }}>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>

            {/* Kalau sudah login */}
            {token ? (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#666' }}>
                        Halo, {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
            )}
        </nav>
    )
}