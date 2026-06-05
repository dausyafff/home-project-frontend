import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Login from './pages/Login'
import Dashboard from "./pages/Dashboard"

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Public */}
                    <Route path="/"         element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/login"    element={<Login />} />

                    {/* Protected — hanya bisa diakses kalau sudah login */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}