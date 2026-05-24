import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Login from './pages/Login'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/"         element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/login"    element={<Login />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}