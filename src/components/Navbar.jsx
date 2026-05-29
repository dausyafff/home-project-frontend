import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
    const { user, token, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await api.post('/logout')
        } catch (e) {
            // tetap logout di frontend meski request gagal
        } finally {
            logout()
        }
    }

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            {token ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    )
}