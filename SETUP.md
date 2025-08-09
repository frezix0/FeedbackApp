# Panduan Setup Aplikasi Feedback Analysis

## Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

### Backend Requirements

- Python 3.8 atau lebih baru
- pip (Python package manager)

### Frontend Requirements

- Node.js 14 atau lebih baru
- npm (Node package manager)

## Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (FastAPI)

#### Windows:

```bash
# Double click file run_backend.bat
# Atau jalankan di Command Prompt:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Linux/Mac:

```bash
# Jalankan di terminal:
chmod +x run_backend.sh
./run_backend.sh

# Atau manual:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: http://localhost:8000
Dokumentasi API: http://localhost:8000/docs

### 2. Menjalankan Frontend (React)

#### Windows:

```bash
# Double click file run_frontend.bat
# Atau jalankan di Command Prompt:
cd frontend
npm install
npm start
```

#### Linux/Mac:

```bash
# Jalankan di terminal:
chmod +x run_frontend.sh
./run_frontend.sh

# Atau manual:
cd frontend
npm install
npm start
```

Frontend akan berjalan di: http://localhost:3000

## Fitur Aplikasi

### 1. Form Feedback (http://localhost:3000/)

- Input nama, email, rating, dan pesan feedback
- Analisis sentimen otomatis menggunakan TextBlob
- Validasi form dan feedback sukses/error

### 2. Dashboard (http://localhost:3000/dashboard)

- Statistik total feedback, rata-rata rating
- Distribusi sentimen (pie chart)
- Distribusi rating (bar chart)
- Daftar feedback terbaru

### 3. Daftar Feedback (http://localhost:3000/feedback)

- Tampilan semua feedback dengan detail
- Filter berdasarkan sentimen dan rating
- Search berdasarkan nama, email, atau pesan
- Sorting berdasarkan tanggal, nama, rating, sentimen
- Ringkasan statistik

## API Endpoints

### Backend API (http://localhost:8000)

- `GET /` - Root endpoint
- `GET /docs` - Swagger documentation
- `POST /feedback` - Submit feedback baru
- `GET /feedback` - Ambil semua feedback (dengan filtering & sorting)
- `GET /feedback/analytics` - Ambil data analitik untuk dashboard
- `GET /feedback/{id}` - Ambil feedback berdasarkan ID

### Parameter Query untuk GET /feedback:

- `sentiment` - Filter berdasarkan sentimen (positif/negatif/neutral)
- `rating` - Filter berdasarkan rating (1-5)
- `sort_by` - Sort berdasarkan field (created_at/name/rating/sentiment)
- `sort_order` - Urutan sort (asc/desc)
- `skip` - Skip records untuk pagination
- `limit` - Limit records untuk pagination

## Database

Aplikasi menggunakan SQLite database yang akan dibuat otomatis di folder `backend/database/feedback.db`

### Schema Database:

```sql
CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    rating INTEGER NOT NULL,
    message TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Analisis Sentimen

Aplikasi menggunakan library TextBlob untuk analisis sentimen sederhana:

- **Positif**: polarity > 0.1
- **Negatif**: polarity < -0.1
- **Neutral**: -0.1 ≤ polarity ≤ 0.1

## Troubleshooting

### Backend Issues:

1. **Port 8000 sudah digunakan**: Ganti port di command uvicorn
2. **Module not found**: Pastikan semua dependencies terinstall dengan `pip install -r requirements.txt`
3. **Database error**: Hapus file `backend/database/feedback.db` dan restart aplikasi

### Frontend Issues:

1. **Port 3000 sudah digunakan**: React akan otomatis menawarkan port alternatif
2. **Module not found**: Jalankan `npm install` di folder frontend
3. **Proxy error**: Pastikan backend berjalan di port 8000

### CORS Issues:

Jika ada masalah CORS, pastikan backend berjalan dan frontend menggunakan proxy yang benar di `package.json`

## Development

### Struktur Proyek:

```
Feedback App/
├── backend/              # FastAPI application
│   ├── main.py          # Main FastAPI app
│   ├── database.py      # Database configuration
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   └── requirements.txt # Python dependencies
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   └── package.json     # Node dependencies
└── README.md           # Project documentation
```

### Menambah Fitur Baru:

1. Tambah endpoint baru di `backend/main.py`
2. Update schema di `backend/schemas.py` jika diperlukan
3. Buat komponen React baru di `frontend/src/components/`
4. Update routing di `frontend/src/App.js`
