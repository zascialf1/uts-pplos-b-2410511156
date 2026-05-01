# Sistem Pengaduan Mahasiswa dengan Google OAuth 2.0

> UTS Pembangunan Perangkat Lunak Berorientasi Service — Kelas B

## Identitas
*Nama*                  : Zaskia Alifa Mardatilla
*NIM*                   : 2410511156
*Program Studi / Kelas* : S1 Informatika / B
*Mata Kuliah*           : Pembangunan Perangkat Lunak Orientasi Servis - UTS

---

---

## Cara Menjalankan

### Prasyarat
- Node.js v18+
- PHP 8.x + Composer
- XAMPP (MySQL)

### 1. Clone Repository
```bash
git clone https://github.com/zascialf1/uts-pplos-b-2410511156.git
cd uts-pplos-b-2410511156
```

### 2. Setup Database
Buka phpMyAdmin dan jalankan SQL berikut:

**auth_db:**
```sql
CREATE DATABASE auth_db;
USE auth_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('mahasiswa', 'admin', 'unit') DEFAULT 'mahasiswa',
    oauth_provider VARCHAR(50) DEFAULT NULL,
    oauth_id VARCHAR(255) DEFAULT NULL,
    foto_profil VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**pengaduan:**
```sql
CREATE DATABASE pengaduan;
USE pengaduan;
CREATE TABLE pengaduan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kategori ENUM('akademik', 'non-akademik') NOT NULL,
    status ENUM('menunggu', 'diproses', 'selesai') DEFAULT 'menunggu',
    rating INT DEFAULT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Setup Environment
Copy `.env.example` ke `.env` di setiap service dan isi nilainya.

### 4. Jalankan Semua Service
```bash
# Terminal 1 - Auth Service
cd services/auth-service && npm install && node index.js

# Terminal 2 - Pengaduan Service
cd services/pengaduan-service && php spark serve --host 127.0.0.1 --port 3002

# Terminal 3 - Disposisi Service
cd services/disposisi-service && npm install && node index.js

# Terminal 4 - API Gateway
cd gateway && npm install && node index.js
```

---

## Peta Endpoint

### Auth Service (`/auth`)
| Method    | Endpoint          | Deskripsi                     |
|-----------|-------------------|-------------------------------|
| POST      | `/auth/register`  | Registrasi user baru          |
| POST      | `/auth/login`     | Login dengan email & password |
| POST      | `/auth/refresh`   | Refresh access token          | 
| POST      | `/auth/logout`    | Logout & blacklist token      |
| GET       | `/auth/google`    | Login dengan Google OAuth     |

### Pengaduan Service (`/pengaduan`)
| Method    | Endpoint                  | Deskripsi             |
|-----------|---------------------------|-----------------------|
| GET       | `/pengaduan`              | List semua pengaduan  |
| POST      | `/pengaduan`              | Buat pengaduan baru   | 
| GET       | `/pengaduan/:id`          | Detail pengaduan      | 
| PUT       | `/pengaduan/:id`          | Update pengaduan      | 
| DELETE    | `/pengaduan/:id`          | Hapus pengaduan       | 
| PUT       | `/pengaduan/:id/rating`   | Beri rating kepuasan  | 

### Disposisi Service (`/disposisi`)
| Method    | Endpoint                  | Deskripsi                         | 
|-----------|---------------------------|-----------------------------------|
| GET       | `/disposisi`              | List pengaduan untuk disposisi    |
| PUT       | `/disposisi/:id/proses`   | Disposisi pengaduan               | 
| PUT       | `/disposisi/:id/selesai`  | Selesaikan pengaduan              | 

---

## Demo Video
> Link akan diupdate setelah video diunggah ke YouTube

