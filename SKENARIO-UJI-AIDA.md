# Dokumen Skenario Uji - AIDA Creative Agency

## Informasi Dokumen
- **Versi**: 1.0
- **Tanggal**: 2025-01-27
- **Total Test Cases**: 40
- **Status**: Draft

---

## 1. Autentikasi & Registrasi

### TU-001: Registrasi pengguna baru dengan email/password
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User belum terdaftar
  - Aplikasi dapat diakses
- **Test Steps**:
  1. Buka halaman utama aplikasi
  2. Klik tombol "Login" atau "Sign In"
  3. Klik link "Create Your Account" atau "Sign Up"
  4. Isi form registrasi:
     - Username: `testuser123`
     - Full Name: `Test User`
     - Email: `testuser@example.com`
     - Password: `password123` (min 8 karakter)
  5. Klik tombol "Get Started"
- **Expected Result**:
  - User berhasil terdaftar
  - Sistem melakukan auto-login
  - User diarahkan ke halaman utama dengan status logged in
  - Data user tersimpan di database dengan role CUSTOMER
- **File terkait**: 
  - `src/app/components/RegisterPopup.tsx`
  - `src/app/api/auth/register/route.ts`
  - `prisma/schema.prisma`

---

### TU-002: Registrasi dengan email yang sudah terdaftar (harus gagal)
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User dengan email `existing@example.com` sudah terdaftar di sistem
- **Test Steps**:
  1. Buka halaman registrasi
  2. Isi form dengan email yang sudah terdaftar:
     - Username: `newuser`
     - Email: `existing@example.com`
     - Password: `password123`
  3. Klik tombol "Get Started"
- **Expected Result**:
  - Registrasi gagal
  - Pesan error ditampilkan: "User with this email already exists"
  - Status HTTP: 400
  - User tidak dibuat di database
- **File terkait**: 
  - `src/app/components/RegisterPopup.tsx`
  - `src/app/api/auth/register/route.ts`

---

### TU-003: Validasi password minimum 8 karakter
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User belum terdaftar
- **Test Steps**:
  1. Buka halaman registrasi
  2. Isi form dengan password kurang dari 8 karakter:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `pass123` (7 karakter)
  3. Klik tombol "Get Started"
- **Expected Result**:
  - Validasi gagal
  - Pesan error ditampilkan: "Password must be at least 8 characters long"
  - Status HTTP: 400
  - User tidak dibuat
- **File terkait**: 
  - `src/app/components/RegisterPopup.tsx`
  - `src/app/api/auth/register/route.ts`

---

### TU-004: Login dengan kredensial valid
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User sudah terdaftar dengan email `user@example.com` dan password `password123`
- **Test Steps**:
  1. Buka halaman utama
  2. Klik tombol "Login"
  3. Masukkan email: `user@example.com`
  4. Masukkan password: `password123`
  5. Klik tombol "Login"
- **Expected Result**:
  - Login berhasil
  - User diarahkan ke halaman utama dengan status logged in
  - Session dibuat
  - `lastLogin` timestamp diupdate di database
  - AuthButton menampilkan menu user (bukan tombol login)
- **File terkait**: 
  - `src/app/components/LoginPopup.tsx`
  - `src/app/api/auth/[...nextauth]/route.ts`

---

### TU-005: Login dengan kredensial invalid
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User sudah terdaftar dengan email `user@example.com` dan password `password123`
- **Test Steps**:
  1. Buka halaman login
  2. Masukkan email: `user@example.com`
  3. Masukkan password yang salah: `wrongpassword`
  4. Klik tombol "Login"
- **Expected Result**:
  - Login gagal
  - Pesan error ditampilkan: "Invalid email or password"
  - Session tidak dibuat
  - User tetap dalam status logged out
- **File terkait**: 
  - `src/app/components/LoginPopup.tsx`
  - `src/app/api/auth/[...nextauth]/route.ts`

---

### TU-006: Login dengan Google OAuth
- **Kategori**: Autentikasi
- **Priority**: Medium
- **Precondition**: 
  - Google OAuth dikonfigurasi dengan benar
  - User memiliki akun Google
- **Test Steps**:
  1. Buka halaman login
  2. Klik tombol "Sign in with Google"
  3. Pilih akun Google
  4. Authorize aplikasi
- **Expected Result**:
  - Login berhasil
  - Jika user belum ada, user baru dibuat dengan authProvider GOOGLE
  - Jika user sudah ada, user login dengan akun yang ada
  - Account record dibuat/diupdate di database
  - `lastLogin` timestamp diupdate
  - User diarahkan ke halaman utama dengan status logged in
- **File terkait**: 
  - `src/app/components/LoginPopup.tsx`
  - `src/app/api/auth/[...nextauth]/route.ts`

---

### TU-007: Auto-login setelah registrasi berhasil
- **Kategori**: Autentikasi
- **Priority**: Medium
- **Precondition**: 
  - User belum terdaftar
- **Test Steps**:
  1. Buka halaman registrasi
  2. Isi form registrasi dengan data valid
  3. Klik tombol "Get Started"
  4. Tunggu proses registrasi selesai
- **Expected Result**:
  - Registrasi berhasil
  - Sistem otomatis melakukan login dengan kredensial yang baru dibuat
  - User langsung masuk ke aplikasi tanpa perlu login manual
  - Session aktif
- **File terkait**: 
  - `src/app/components/RegisterPopup.tsx`
  - `src/app/api/auth/register/route.ts`

---

### TU-008: Logout pengguna
- **Kategori**: Autentikasi
- **Priority**: High
- **Precondition**: 
  - User sudah login
- **Test Steps**:
  1. Pastikan user dalam status logged in
  2. Klik menu user (dari AuthButton)
  3. Klik tombol "Logout" atau "Sign Out"
- **Expected Result**:
  - Session dihapus
  - User diarahkan ke halaman utama dengan status logged out
  - AuthButton menampilkan tombol "Login" kembali
  - User tidak dapat mengakses fitur yang memerlukan autentikasi
- **File terkait**: 
  - `src/app/components/AuthButton.tsx`
  - `src/app/api/auth/[...nextauth]/route.ts`

---

## 2. Manajemen Produk (Admin)

### TU-009: Admin dapat membuat produk baru
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Admin panel dapat diakses
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke halaman Shop (`/shop`)
  3. Klik tombol "Admin Panel"
  4. Klik tombol "Create New"
  5. Klik "Add Product"
  6. Isi form produk:
     - Title: `Test Product`
     - Subtitle: `Test Subtitle`
     - Description: `This is a test product description`
     - Price: `100000`
     - Image URL: `https://example.com/image.jpg`
     - Category: `LIGHTROOM_PRESET`
  7. Klik tombol "Add Product"
- **Expected Result**:
  - Produk berhasil dibuat
  - Produk muncul di daftar produk di shop
  - Status produk: ACTIVE
  - Data produk tersimpan di database
  - Form reset dan admin panel tertutup
- **File terkait**: 
  - `src/app/components/AdminProductManager.tsx`
  - `src/app/api/products/route.ts`
  - `src/app/shop/page.tsx`

---

### TU-010: Validasi field wajib saat membuat produk
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Buka admin panel dan form "Add Product"
  3. Coba submit form tanpa mengisi field wajib (title, description, price, thumbnailUrl)
  4. Atau isi dengan data tidak valid
- **Expected Result**:
  - Validasi gagal
  - Pesan error ditampilkan: "Missing required fields"
  - Status HTTP: 400
  - Produk tidak dibuat
  - Form tetap terbuka dengan error message
- **File terkait**: 
  - `src/app/components/AdminProductManager.tsx`
  - `src/app/api/products/route.ts`

---

### TU-011: Non-admin tidak dapat membuat produk
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - User dengan role CUSTOMER sudah login (atau tidak login)
- **Test Steps**:
  1. Login sebagai customer (atau tidak login)
  2. Navigasi ke halaman Shop
  3. Coba akses endpoint POST `/api/products` langsung dengan data produk
  4. Atau coba akses admin panel melalui URL langsung
- **Expected Result**:
  - Admin panel tidak muncul untuk customer
  - Jika mencoba POST langsung, mendapat error: "Forbidden - Admin access required"
  - Status HTTP: 403
  - Produk tidak dibuat
- **File terkait**: 
  - `src/app/api/products/route.ts`
  - `src/app/shop/page.tsx`

---

### TU-012: Admin dapat melihat daftar produk
- **Kategori**: Produk
- **Priority**: Medium
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Terdapat beberapa produk di database
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke halaman Shop
  3. Lihat daftar produk yang ditampilkan
- **Expected Result**:
  - Semua produk dengan status ACTIVE ditampilkan
  - Produk diurutkan berdasarkan createdAt (terbaru pertama)
  - Admin panel tersedia untuk admin
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/api/products/route.ts`

---

### TU-013: Admin dapat mengupdate produk
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Terdapat produk dengan ID tertentu di database
- **Test Steps**:
  1. Login sebagai admin
  2. Kirim request PUT ke `/api/products/[id]` dengan data update:
     - Title: `Updated Product Title`
     - Price: `150000`
     - Description: `Updated description`
  3. Verifikasi perubahan
- **Expected Result**:
  - Produk berhasil diupdate
  - Data produk di database terupdate
  - Perubahan terlihat di halaman shop
  - Status HTTP: 200
- **File terkait**: 
  - `src/app/api/products/[id]/route.ts`

---

### TU-014: Admin dapat menghapus produk
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Terdapat produk dengan ID tertentu di database
- **Test Steps**:
  1. Login sebagai admin
  2. Kirim request DELETE ke `/api/products/[id]`
  3. Verifikasi penghapusan
- **Expected Result**:
  - Produk berhasil dihapus dari database
  - Produk tidak muncul lagi di daftar produk
  - Status HTTP: 200 dengan response `{ success: true }`
- **File terkait**: 
  - `src/app/api/products/[id]/route.ts`

---

### TU-015: Produk dengan status ACTIVE muncul di shop
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - Terdapat produk dengan status ACTIVE di database
- **Test Steps**:
  1. Buka halaman Shop (`/shop`)
  2. Lihat daftar produk yang ditampilkan
- **Expected Result**:
  - Semua produk dengan status ACTIVE ditampilkan
  - Produk dapat dilihat oleh semua user (termasuk yang tidak login)
  - Produk dapat ditambahkan ke cart
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/api/products/route.ts`

---

### TU-016: Produk dengan status DRAFT tidak muncul di shop
- **Kategori**: Produk
- **Priority**: High
- **Precondition**: 
  - Terdapat produk dengan status DRAFT di database
- **Test Steps**:
  1. Buka halaman Shop (`/shop`)
  2. Lihat daftar produk yang ditampilkan
  3. Verifikasi produk dengan status DRAFT
- **Expected Result**:
  - Produk dengan status DRAFT tidak ditampilkan di shop
  - Hanya produk dengan status ACTIVE yang muncul
  - Query database menggunakan filter `status: "ACTIVE"`
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/api/products/route.ts`

---

## 3. Shopping Cart

### TU-017: Menambahkan produk ke keranjang
- **Kategori**: Cart
- **Priority**: High
- **Precondition**: 
  - Halaman Shop terbuka
  - Terdapat produk dengan status ACTIVE
- **Test Steps**:
  1. Buka halaman Shop
  2. Klik tombol "Add to Cart" pada salah satu produk
  3. Verifikasi item ditambahkan
- **Expected Result**:
  - Produk berhasil ditambahkan ke keranjang
  - Badge keranjang menampilkan jumlah item yang bertambah
  - Item dapat dilihat saat membuka modal keranjang
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/shop/ProductCard.tsx`

---

### TU-018: Menghapus produk dari keranjang
- **Kategori**: Cart
- **Priority**: High
- **Precondition**: 
  - Keranjang sudah berisi minimal 1 item
- **Test Steps**:
  1. Buka halaman Shop
  2. Tambahkan produk ke keranjang
  3. Buka modal keranjang
  4. Klik tombol "Remove" pada salah satu item
- **Expected Result**:
  - Item berhasil dihapus dari keranjang
  - Badge keranjang menampilkan jumlah item yang berkurang
  - Item tidak muncul lagi di modal keranjang
  - Total harga terupdate
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/shop/CartModal.tsx`

---

### TU-019: Menghitung total harga keranjang
- **Kategori**: Cart
- **Priority**: High
- **Precondition**: 
  - Keranjang berisi minimal 2 produk dengan harga berbeda
- **Test Steps**:
  1. Tambahkan beberapa produk ke keranjang dengan quantity berbeda
  2. Buka modal keranjang
  3. Perhatikan total harga yang ditampilkan
- **Expected Result**:
  - Total harga dihitung dengan benar: sum(price × quantity) untuk semua item
  - Total ditampilkan dengan format: `IDR{total}`
  - Perhitungan update otomatis saat item ditambah/dihapus
- **File terkait**: 
  - `src/app/shop/CartModal.tsx`
  - `src/app/shop/page.tsx`

---

### TU-020: Menampilkan jumlah item di badge keranjang
- **Kategori**: Cart
- **Priority**: Medium
- **Precondition**: 
  - Halaman Shop terbuka
- **Test Steps**:
  1. Tambahkan beberapa produk ke keranjang
  2. Perhatikan badge pada ikon keranjang
- **Expected Result**:
  - Badge menampilkan jumlah total item di keranjang
  - Badge hanya muncul jika keranjang tidak kosong
  - Badge update otomatis saat item ditambah/dihapus
- **File terkait**: 
  - `src/app/shop/page.tsx`

---

### TU-021: Menampilkan modal keranjang dengan item
- **Kategori**: Cart
- **Priority**: High
- **Precondition**: 
  - Keranjang berisi minimal 1 item
- **Test Steps**:
  1. Tambahkan produk ke keranjang
  2. Klik ikon keranjang untuk membuka modal
- **Expected Result**:
  - Modal keranjang terbuka
  - Semua item di keranjang ditampilkan dengan:
    - Thumbnail gambar
    - Nama produk
    - Harga per item
    - Quantity
    - Tombol remove
  - Total harga ditampilkan
  - Form payment ditampilkan di sisi kanan
- **File terkait**: 
  - `src/app/shop/CartModal.tsx`

---

## 4. Role & Authorization

### TU-022: Customer tidak dapat mengakses admin panel
- **Kategori**: Authorization
- **Priority**: High
- **Precondition**: 
  - User dengan role CUSTOMER sudah login
- **Test Steps**:
  1. Login sebagai customer
  2. Navigasi ke halaman Shop
  3. Perhatikan apakah admin panel muncul
- **Expected Result**:
  - Admin panel tidak muncul untuk customer
  - Tombol "Admin Panel" tidak ditampilkan
  - Customer hanya melihat fitur customer biasa
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/api/auth/check-role/route.ts`

---

### TU-023: Admin dapat mengakses admin panel
- **Kategori**: Authorization
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke halaman Shop
  3. Perhatikan apakah admin panel muncul
  4. Klik tombol "Admin Panel"
- **Expected Result**:
  - Admin panel muncul untuk admin
  - Tombol "Admin Panel" ditampilkan
  - Admin dapat membuka dan menggunakan admin panel
  - Admin dapat membuat produk baru
- **File terkait**: 
  - `src/app/shop/page.tsx`
  - `src/app/api/auth/check-role/route.ts`

---

### TU-024: Endpoint API memvalidasi role admin
- **Kategori**: Authorization
- **Priority**: High
- **Precondition**: 
  - User dengan role CUSTOMER sudah login
- **Test Steps**:
  1. Login sebagai customer
  2. Kirim request POST ke `/api/products` dengan data produk
  3. Perhatikan response
- **Expected Result**:
  - Request ditolak
  - Status HTTP: 403
  - Pesan error: "Forbidden - Admin access required"
  - Produk tidak dibuat
- **File terkait**: 
  - `src/app/api/products/route.ts`
  - `src/app/api/products/[id]/route.ts`

---

### TU-025: Unauthenticated user tidak dapat mengakses fitur terproteksi
- **Kategori**: Authorization
- **Priority**: High
- **Precondition**: 
  - User tidak login (tidak ada session aktif)
- **Test Steps**:
  1. Pastikan tidak ada session aktif (logout jika perlu)
  2. Coba akses endpoint POST `/api/products`
  3. Coba akses admin panel
- **Expected Result**:
  - Request ditolak
  - Status HTTP: 401
  - Pesan error: "Unauthorized"
  - Admin panel tidak muncul
- **File terkait**: 
  - `src/app/api/products/route.ts`
  - `src/app/shop/page.tsx`

---

## 5. UI/UX & Navigation

### TU-026: Navigasi antar halaman (Home, Shop, Portfolio)
- **Kategori**: UI
- **Priority**: Medium
- **Precondition**: 
  - Aplikasi dapat diakses
- **Test Steps**:
  1. Buka halaman Home (`/`)
  2. Klik link "Shop" di navbar
  3. Klik link "Portfolio" di navbar
  4. Klik link "Home" di navbar
- **Expected Result**:
  - Navigasi berfungsi dengan benar
  - Halaman yang sesuai ditampilkan
  - URL berubah sesuai halaman
  - Tidak ada error atau page not found
- **File terkait**: 
  - `src/app/components/Navbar.tsx`
  - `src/app/page.tsx`
  - `src/app/shop/page.tsx`
  - `src/app/portofolio/page.tsx`

---

### TU-027: Modal popup login/register berfungsi
- **Kategori**: UI
- **Priority**: High
- **Precondition**: 
  - User belum login
- **Test Steps**:
  1. Buka halaman utama
  2. Klik tombol "Login"
  3. Verifikasi modal login muncul
  4. Klik link "Create Your Account"
  5. Verifikasi modal register muncul
  6. Klik tombol close atau klik di luar modal
- **Expected Result**:
  - Modal login muncul dengan animasi
  - Form login ditampilkan dengan benar
  - Transisi ke modal register berfungsi
  - Modal dapat ditutup dengan klik close atau klik di luar
  - Animasi closing berfungsi
- **File terkait**: 
  - `src/app/components/LoginPopup.tsx`
  - `src/app/components/RegisterPopup.tsx`

---

### TU-028: Modal produk menampilkan detail lengkap
- **Kategori**: UI
- **Priority**: Medium
- **Precondition**: 
  - Halaman Shop terbuka
  - Terdapat produk di daftar
- **Test Steps**:
  1. Buka halaman Shop
  2. Klik pada salah satu produk card
  3. Perhatikan modal produk yang muncul
- **Expected Result**:
  - Modal produk muncul
  - Detail lengkap ditampilkan:
    - Gambar produk
    - Title
    - Subtitle
    - Description
    - Price
    - Tombol "Add to Cart"
  - Modal dapat ditutup
- **File terkait**: 
  - `src/app/shop/ProductModal.tsx`
  - `src/app/shop/page.tsx`

---

### TU-029: Responsive design pada berbagai ukuran layar
- **Kategori**: UI
- **Priority**: Medium
- **Precondition**: 
  - Aplikasi dapat diakses
- **Test Steps**:
  1. Buka aplikasi di desktop (1920x1080)
  2. Buka aplikasi di tablet (768x1024)
  3. Buka aplikasi di mobile (375x667)
  4. Perhatikan layout dan elemen UI
- **Expected Result**:
  - Layout menyesuaikan dengan ukuran layar
  - Elemen tidak overlap atau terpotong
  - Text tetap readable
  - Navigation tetap accessible
  - Modal dan popup tetap berfungsi dengan baik
- **File terkait**: 
  - `src/app/globals.css`
  - `src/app/shop/shop.css`
  - Semua komponen UI

---

## 6. API Endpoints

### TU-030: GET /api/products mengembalikan produk ACTIVE
- **Kategori**: API
- **Priority**: High
- **Precondition**: 
  - Terdapat produk dengan status ACTIVE dan DRAFT di database
- **Test Steps**:
  1. Kirim request GET ke `/api/products`
  2. Perhatikan response
- **Expected Result**:
  - Status HTTP: 200
  - Response berisi array produk
  - Hanya produk dengan status ACTIVE yang dikembalikan
  - Produk diurutkan berdasarkan createdAt (desc)
  - Response dalam format JSON
- **File terkait**: 
  - `src/app/api/products/route.ts`

---

### TU-031: POST /api/products memerlukan autentikasi admin
- **Kategori**: API
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Kirim request POST ke `/api/products` dengan data produk valid
  3. Perhatikan response
- **Expected Result**:
  - Status HTTP: 201
  - Produk berhasil dibuat
  - Response berisi data produk yang baru dibuat
  - Produk tersimpan di database dengan status ACTIVE
- **File terkait**: 
  - `src/app/api/products/route.ts`

---

### TU-032: GET /api/products/[id] mengembalikan detail produk
- **Kategori**: API
- **Priority**: Medium
- **Precondition**: 
  - Terdapat produk dengan ID tertentu di database
- **Test Steps**:
  1. Ambil ID produk yang valid
  2. Kirim request GET ke `/api/products/[id]`
  3. Perhatikan response
- **Expected Result**:
  - Status HTTP: 200
  - Response berisi detail lengkap produk:
    - id, title, subtitle, description
    - price, category, status
    - thumbnailUrl, imageUrls
    - fileUrl, fileSize, tags
    - createdAt, updatedAt
  - Jika produk tidak ditemukan, status 404
- **File terkait**: 
  - `src/app/api/products/[id]/route.ts`

---

### TU-033: PUT /api/products/[id] memerlukan autentikasi admin
- **Kategori**: API
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Terdapat produk dengan ID tertentu di database
- **Test Steps**:
  1. Login sebagai admin
  2. Kirim request PUT ke `/api/products/[id]` dengan data update
  3. Perhatikan response
- **Expected Result**:
  - Status HTTP: 200
  - Produk berhasil diupdate
  - Response berisi data produk yang sudah diupdate
  - Data di database terupdate
- **File terkait**: 
  - `src/app/api/products/[id]/route.ts`

---

### TU-034: DELETE /api/products/[id] memerlukan autentikasi admin
- **Kategori**: API
- **Priority**: High
- **Precondition**: 
  - User dengan role ADMIN sudah login
  - Terdapat produk dengan ID tertentu di database
- **Test Steps**:
  1. Login sebagai admin
  2. Kirim request DELETE ke `/api/products/[id]`
  3. Perhatikan response
- **Expected Result**:
  - Status HTTP: 200
  - Response: `{ success: true }`
  - Produk dihapus dari database
  - Relasi terkait (CartItem) terhapus karena cascade
- **File terkait**: 
  - `src/app/api/products/[id]/route.ts`
  - `prisma/schema.prisma`

---

### TU-035: POST /api/auth/register validasi input
- **Kategori**: API
- **Priority**: High
- **Precondition**: 
  - Endpoint dapat diakses
- **Test Steps**:
  1. Kirim request POST ke `/api/auth/register` tanpa body
  2. Kirim request dengan email invalid
  3. Kirim request dengan password kurang dari 8 karakter
  4. Kirim request dengan data valid
- **Expected Result**:
  - Request tanpa body: Status 400, error "Email and password are required"
  - Password < 8 karakter: Status 400, error "Password must be at least 8 characters long"
  - Email sudah terdaftar: Status 400, error "User with this email already exists"
  - Data valid: Status 201, user berhasil dibuat
- **File terkait**: 
  - `src/app/api/auth/register/route.ts`

---

### TU-036: GET /api/auth/check-role mengembalikan role user
- **Kategori**: API
- **Priority**: Medium
- **Precondition**: 
  - User sudah login (atau tidak login)
- **Test Steps**:
  1. Login sebagai user
  2. Kirim request GET ke `/api/auth/check-role`
  3. Perhatikan response
- **Expected Result**:
  - Jika user login: Status 200, response berisi `{ role: "ADMIN" | "CUSTOMER", user: {...} }`
  - Jika user tidak login: Status 401, response `{ role: null, message: "Not authenticated" }`
  - Jika user tidak ditemukan: Status 404, response `{ role: null, message: "User not found" }`
- **File terkait**: 
  - `src/app/api/auth/check-role/route.ts`

---

## 7. Database & Data Integrity

### TU-037: User tidak dapat memiliki email duplikat
- **Kategori**: Database
- **Priority**: High
- **Precondition**: 
  - User dengan email `test@example.com` sudah terdaftar
- **Test Steps**:
  1. Coba buat user baru dengan email yang sama: `test@example.com`
  2. Perhatikan error yang terjadi
- **Expected Result**:
  - Database constraint error terjadi
  - Registrasi gagal
  - Error message: "User with this email already exists"
  - User baru tidak dibuat
  - Unique constraint pada field email bekerja
- **File terkait**: 
  - `prisma/schema.prisma` (User model dengan `email @unique`)
  - `src/app/api/auth/register/route.ts`

---

### TU-038: User tidak dapat memiliki username duplikat
- **Kategori**: Database
- **Priority**: Medium
- **Precondition**: 
  - User dengan username `testuser` sudah terdaftar
- **Test Steps**:
  1. Coba buat user baru dengan username yang sama: `testuser`
  2. Perhatikan error yang terjadi
- **Expected Result**:
  - Database constraint error terjadi
  - Registrasi gagal
  - Error message: "Username is already taken"
  - User baru tidak dibuat
  - Unique constraint pada field username bekerja
- **File terkait**: 
  - `prisma/schema.prisma` (User model dengan `username @unique`)
  - `src/app/api/auth/register/route.ts`

---

### TU-039: Relasi Purchase-User-Product terpelihara
- **Kategori**: Database
- **Priority**: Medium
- **Precondition**: 
  - User dan Product sudah ada di database
- **Test Steps**:
  1. Buat Purchase dengan userId dan productId yang valid
  2. Buat PurchaseItem terkait
  3. Verifikasi relasi di database
  4. Coba hapus User atau Product yang memiliki Purchase
- **Expected Result**:
  - Purchase berhasil dibuat dengan relasi ke User dan Product
  - PurchaseItem berhasil dibuat dengan relasi ke Purchase dan Product
  - Jika User dihapus, Purchase terhapus (Cascade)
  - Jika Product dihapus, PurchaseItem tidak bisa dihapus (Restrict) - harus hapus Purchase dulu
- **File terkait**: 
  - `prisma/schema.prisma` (Purchase, PurchaseItem models)

---

### TU-040: CartItem terhapus saat produk dihapus (Cascade)
- **Kategori**: Database
- **Priority**: Medium
- **Precondition**: 
  - Produk ada di database
  - User memiliki CartItem untuk produk tersebut
- **Test Steps**:
  1. Buat CartItem untuk user dan product tertentu
  2. Hapus Product dari database
  3. Verifikasi CartItem
- **Expected Result**:
  - Saat Product dihapus, semua CartItem yang terkait terhapus otomatis (Cascade)
  - Tidak ada orphaned CartItem di database
  - Relasi cascade pada CartItem bekerja dengan benar
- **File terkait**: 
  - `prisma/schema.prisma` (CartItem model dengan `onDelete: Cascade`)

---

## Ringkasan

### Statistik Test Cases
- **Total**: 40 test cases
- **High Priority**: 25
- **Medium Priority**: 15
- **Low Priority**: 0

### Distribusi per Kategori
- **Autentikasi**: 8 test cases
- **Produk**: 8 test cases
- **Cart**: 5 test cases
- **Authorization**: 4 test cases
- **UI**: 4 test cases
- **API**: 7 test cases
- **Database**: 4 test cases

### Status Implementasi
- Semua test cases telah didokumentasikan
- Siap untuk implementasi testing (unit test, integration test, atau manual testing)

