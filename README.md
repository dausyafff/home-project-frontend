# Dausyaf Portfolio — Frontend

Single Page Application untuk personal portfolio, dibangun dengan React dan Tailwind CSS. Mengonsumsi REST API dari [dausyaf-backend](https://github.com/dausyafff/dausyaf-backend) untuk menampilkan dan mengelola projects, skills, dan blog posts.

🔗 **Live Demo:** _(akan ditambahkan setelah deploy)_
🔗 **Backend repo:** [dausyaf-backend](https://github.com/dausyafff/dausyaf-backend)

---

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=flat&logo=axios&logoColor=white)

---

## Fitur

- **Halaman publik** — landing page, daftar project (search + pagination), dan halaman detail project
- **Autentikasi** — register, login, dan logout terhubung ke Sanctum token auth
- **Dashboard admin** — CRUD penuh untuk Projects, Skills, dan Posts dalam satu panel bertab
- **Upload gambar** — form upload thumbnail project dengan preview sebelum submit
- **Protected routes** — halaman dashboard hanya bisa diakses setelah login
- **Auto-logout saat token expired** — axios interceptor mendeteksi response 401 dan mengarahkan ke halaman login
- **Tampilan adaptif** — konten dan navigasi berubah sesuai status login (publik vs admin)
- **Fully responsive** — hamburger menu untuk tampilan mobile

---

## Arsitektur

```
src/
├── api/
│   └── axios.js          ← instance axios + interceptor token & 401
├── components/
│   ├── Navbar.jsx         ← navigasi, berubah sesuai status login
│   ├── ProjectCard.jsx    ← card project (reusable di list & dashboard)
│   ├── PostsTab.jsx       ← CRUD posts (komponen terpisah)
│   └── ProtectedRoute.jsx ← guard untuk halaman yang butuh login
├── context/
│   └── AuthContext.jsx    ← state global: token, user, login(), logout()
├── pages/
│   ├── Home.jsx           ← landing page (publik / admin)
│   ├── Projects.jsx       ← list project + search + pagination
│   ├── ProjectDetail.jsx  ← detail satu project
│   ├── Login.jsx / Register.jsx
│   ├── Dashboard.jsx      ← panel admin (tab: Projects, Skills, Posts)
│   └── NotFound.jsx
├── App.jsx                ← routing
└── main.jsx                ← entry point
```

State autentikasi dikelola lewat **Context API** sehingga `token` dan `user` bisa diakses dari komponen manapun tanpa props drilling. Token disimpan di `localStorage` agar sesi tetap berjalan walau browser ditutup, dan otomatis dibersihkan saat backend mengembalikan response `401` (token expired/invalid).

---

## Instalasi & Menjalankan Secara Lokal

### Prasyarat

- Node.js 18+
- [dausyaf-backend](https://github.com/dausyafff/dausyaf-backend) sudah berjalan di `http://localhost:8080`

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/dausyafff/dausyaf-frontend.git
cd dausyaf-frontend

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di **http://localhost:5173**

> Pastikan backend API sudah aktif di `http://localhost:8080` dan domain frontend sudah diizinkan di konfigurasi CORS backend (`config/cors.php`).

---

## Akun untuk Mencoba Dashboard

```
URL    : http://localhost:5173/login
Email  : dausyaf@gmail.com
Password : password123
```

(Akun ini tersedia setelah menjalankan seeder di repo backend)

---

## Alur Autentikasi

```
1. User login → POST /api/login → terima token
2. Token disimpan di localStorage + AuthContext
3. Setiap request API → axios interceptor sisipkan
   header "Authorization: Bearer {token}" otomatis
4. Jika token expired → backend balas 401
5. Interceptor menangkap 401 → hapus localStorage →
   redirect ke /login dengan pesan "sesi telah berakhir"
```

---

## Konsep yang Diterapkan

- **Debounce search** — request API hanya dikirim 500ms setelah user berhenti mengetik, mengurangi beban server
- **Controlled components** — semua input form disinkronkan dengan React state
- **FormData untuk upload file** — form project menggunakan `multipart/form-data`, dengan method spoofing (`_method: PUT`) untuk update yang menyertakan file
- **Conditional rendering** — tampilan Navbar dan Home berubah berdasarkan status login, tombol edit/hapus hanya muncul untuk admin

---

## Tentang Project Ini

Frontend ini dikembangkan terpisah dari backend untuk mendemonstrasikan pola **decoupled architecture** — pola yang umum dipakai di industri di mana backend (Laravel) dan frontend (React) dikembangkan dan di-deploy secara independen, saling terhubung lewat REST API.

---

## Kontak

- **Email:** muhammaddausyaf@gmail.com
- **Instagram:** [@dusyaf\_](https://instagram.com)
- **GitHub:** [@dausyafff](https://github.com/dausyafff)
