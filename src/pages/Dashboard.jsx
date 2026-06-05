import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <p>Selamat datang, {user?.name}!</p>
            <p>Ini halaman yang hanya bisa diakses setelah login.</p>
        </div>
    )
}