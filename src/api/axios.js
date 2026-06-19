import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

// Interceptor request — sisipkan token (sudah ada sebelumnya)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor response — BARU: tangkap kalau dapat 401
api.interceptors.response.use(
    (response) => response, // kalau sukses, lanjutkan seperti biasa
    (error) => {
        // Kalau dapat 401 (token expired/invalid)
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            // redirect ke login, kasih pesan
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?expired=true'
            }
        }
        return Promise.reject(error)
    }
)

export default api