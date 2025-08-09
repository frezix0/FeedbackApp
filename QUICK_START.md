# 🚀 Quick Start Guide

## ⚡ Langkah Cepat Menjalankan Aplikasi

### 1. Jalankan Backend

```bash
run_backend.bat

#terminal
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Jalankan Frontend (di terminal baru)

```bash
run_frontend.bat

#terminal
cd frontend
npm install
npm start
```

### 3. Buka Aplikasi

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

### 4. Tambah Data Contoh (Optional)

```bash
add_sample_data.bat

#terminal
python sample_data.py
```