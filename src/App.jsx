import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <h1>Dausyaf Tes</h1>
                <Routes>
                    {/* Public */}
                    <Route path="/"                  element={<Home />} />
                    <Route path="/projects"          element={<Projects />} />
                    <Route path="/projects/:slug"    element={<ProjectDetail />} />
                    <Route path="/login"             element={<Login />} />
                    <Route path="/register"          element={<Register />} />

                    {/* Protected */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}