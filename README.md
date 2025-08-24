# 📱 Self Order Machine

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React Native](https://img.shields.io/badge/frontend-react--native-blue)
![Node.js](https://img.shields.io/badge/backend-node.js-green)
![TypeScript](https://img.shields.io/badge/language-typescript-007acc)

## 🚀 Deskripsi
Self Order Machine adalah aplikasi mobile berbasis React Native yang memungkinkan pelanggan memesan produk (misal donat, minuman, dll.) secara mandiri melalui perangkat mobile.  
Backend menggunakan Node.js + Express untuk menangani pembayaran, nomor antrian, dan manajemen order.

---

## 🎯 Fitur Utama

### Frontend (React Native + TypeScript)
- Tampilan mobile modern dan responsif
- Pemilihan produk, jumlah, dan keranjang belanja
- Kode promo & diskon otomatis
- Metode pembayaran: Cash & QRIS
- Animasi sukses order + countdown untuk kembali ke halaman utama

### Backend (Node.js + Express)
- Endpoint generate QRIS & status pembayaran
- Endpoint nomor antrian (increment otomatis)
- CORS & JSON parsing
- Simulasi auto-pay untuk testing
- Logika diskon & promo code

---

## ⚙️ Tech Stack
**Frontend:**  
- React Native (Expo)  
- TypeScript  

**Backend:**  
- Node.js  
- Express.js  

---

## 📦 Instalasi & Cara Penggunaan

### 1️⃣ Backend

1. Masuk ke folder backend:
```bash
cd backend
```
2. Install Dependencies
```bash
npm install express cors
```
3. Jalanin server 
```bash
node server.mjs
```

### 2️⃣ Frontend

1. Masuk ke folder front-end 
```bash
cd selfOrder
```
2. Install Dependencies
```bash
npm install
```
3. Jalanin App nya 
```bash
npx expo start
```

