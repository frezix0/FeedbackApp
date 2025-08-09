# 🎯 Feedback Analysis App

Aplikasi lengkap untuk mengumpulkan, menyimpan, dan menganalisis feedback pengguna dengan analisis sentimen otomatis menggunakan AI sederhana.

## 🚀 Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Tech Stack

| Component    | Technology              | Purpose                     |
| ------------ | ----------------------- | --------------------------- |
| **Frontend** | React.js + Tailwind CSS | UI interaktif dan responsif |
| **Backend**  | FastAPI + SQLAlchemy    | API dan proses analitik     |
| **Database** | SQLite                  | Penyimpanan data feedback   |
| **Analisis** | TextBlob + Pandas       | Analisis sentimen sederhana |
| **Charts**   | Recharts                | Visualisasi data dashboard  |
| **Icons**    | Lucide React            | Icon modern dan konsisten   |

## ✨ Fitur Utama

### 📝 Form Input Feedback

- Form input lengkap (nama, email, rating, pesan)
- Validasi real-time
- Analisis sentimen otomatis
- Feedback sukses/error

### 📊 Dashboard Analisis

- Statistik real-time (total, rata-rata, distribusi)
- Pie chart distribusi sentimen
- Bar chart distribusi rating
- Daftar feedback terbaru

### 🔍 Daftar Feedback dengan Filtering & Sorting

- Search berdasarkan nama, email, atau pesan
- Filter berdasarkan sentimen (positif/negatif/neutral)
- Filter berdasarkan rating (1-5 bintang)
- Sorting berdasarkan tanggal, nama, rating, sentimen
- Ringkasan statistik

### 🤖 Analisis Sentimen Otomatis

- Menggunakan TextBlob untuk analisis bahasa Indonesia
- Kategorisasi: Positif, Negatif, Neutral
- Berdasarkan polarity score

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm atau yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd feedback-app
```

### 2. Jalankan Backend

```bash
# Windows
run_backend.bat

# Linux/Mac
chmod +x run_backend.sh
./run_backend.sh

# Manual
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Jalankan Frontend

```bash
# Windows
run_frontend.bat

# Linux/Mac
chmod +x run_frontend.sh
./run_frontend.sh

# Manual
cd frontend
npm install
npm start
```

### 4. Tambah Data Contoh (Optional)

```bash
# Windows
add_sample_data.bat

# Manual
python sample_data.py
```

## 📁 Struktur Proyek

```
Feedback App/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── FeedbackForm.js # Form input feedback
│   │   │   ├── Dashboard.js    # Dashboard analisis
│   │   │   ├── FeedbackList.js # Daftar feedback
│   │   │   └── Navbar.js       # Navigation bar
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   ├── package.json            # Node dependencies
│   └── tailwind.config.js      # Tailwind configuration
├── 📁 backend/                 # FastAPI application
│   ├── main.py                 # Main FastAPI app
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── sentiment_analyzer.py   # Sentiment analysis module
│   └── requirements.txt        # Python dependencies
├── 📁 database/                # SQLite database files
├── 📄 README.md               # Project documentation
├── 📄 SETUP.md                # Detailed setup guide
├── 📄 FEATURES.md             # Complete feature list
├── 📄 sample_data.py          # Sample data generator
├── 📄 CLEANUP_SUMMARY.md      # Cleanup documentation
└── 🚀 run_*.bat/sh            # Quick start scripts
```

## 🔧 API Endpoints

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| `GET`  | `/`                   | Root endpoint           |
| `GET`  | `/docs`               | Swagger documentation   |
| `POST` | `/feedback`           | Submit feedback baru    |
| `GET`  | `/feedback`           | Ambil semua feedback    |
| `GET`  | `/feedback/analytics` | Data analitik dashboard |
| `GET`  | `/feedback/{id}`      | Ambil feedback by ID    |

### Query Parameters untuk GET /feedback

- `sentiment` - Filter by sentiment
- `rating` - Filter by rating
- `sort_by` - Sort field (created_at/name/rating/sentiment)
- `sort_order` - Sort order (asc/desc)
- `skip` - Pagination offset
- `limit` - Pagination limit

## 🗄️ Database Schema

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

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean design dengan Tailwind CSS
- **Interactive Elements**: Hover effects, loading states
- **Data Visualization**: Charts dengan Recharts
- **Color Coding**: Semantic colors untuk sentimen
- **Accessibility**: Keyboard navigation, screen reader support

## 🔒 Security & Performance

- **Input Validation**: Client & server-side validation
- **CORS Configuration**: Secure cross-origin requests
- **SQL Injection Protection**: SQLAlchemy ORM
- **Error Handling**: Graceful error management
- **Loading States**: User feedback during operations

## 📊 Analisis Sentimen

Aplikasi menggunakan TextBlob untuk analisis sentimen sederhana:

- **Positif**: polarity > 0.1
- **Negatif**: polarity < -0.1
- **Neutral**: -0.1 ≤ polarity ≤ 0.1

## 🛠️ Development

### Code Quality

- Modular architecture
- Clean code principles
- Consistent naming conventions
- Comprehensive documentation

### Testing Ready

- Unit test structure
- API testing framework
- Integration test setup

### Deployment Ready

- Environment configuration
- Production build optimization
- Database migration support

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Panduan setup detail
- **[FEATURES.md](FEATURES.md)** - Dokumentasi fitur lengkap
- **[API Docs](http://localhost:8000/docs)** - Swagger documentation

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Jika mengalami masalah:

1. Cek [SETUP.md](SETUP.md) untuk troubleshooting
2. Pastikan semua dependencies terinstall
3. Cek console browser dan terminal untuk error messages
4. Buka issue di repository

---

**Dibuat dengan ❤️ menggunakan React, FastAPI, dan AI untuk analisis sentimen**
