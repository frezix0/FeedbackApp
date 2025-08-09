# Troubleshooting Guide

## Masalah: Frontend tidak menampilkan feedback

### Langkah-langkah Diagnosa:

1. **Periksa apakah backend berjalan:**

   ```bash
   # Di terminal backend
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Periksa apakah frontend berjalan:**

   ```bash
   # Di terminal frontend
   cd frontend
   npm start
   ```

3. **Test koneksi backend:**

   ```bash
   curl http://localhost:8000/feedback
   ```

4. **Test koneksi dari frontend:**

   - Buka browser ke http://localhost:3000
   - Lihat apakah ada error di console browser (F12)

5. **Periksa data di database:**
   ```bash
   cd backend
   python -c "from database import get_db, engine; from models import Feedback; from sqlalchemy.orm import Session; db = Session(engine); print(f'Jumlah feedback: {db.query(Feedback).count()}'); db.close()"
   ```

### Solusi Umum:

1. **Jika database kosong:**

   ```bash
   python add_sample_data.py
   ```

2. **Jika ada masalah CORS:**

   - Pastikan backend CORS dikonfigurasi untuk `http://localhost:3000`
   - Restart backend setelah perubahan

3. **Jika ada masalah proxy:**

   - Periksa `package.json` di frontend, pastikan ada `"proxy": "http://localhost:8000"`
   - Atau gunakan konfigurasi axios dengan baseURL eksplisit

4. **Jika ada masalah port:**
   - Pastikan port 8000 dan 3000 tidak digunakan aplikasi lain
   - Gunakan `netstat -an | findstr :8000` untuk mengecek

### Debugging:

1. **Buka Developer Tools di browser (F12)**
2. **Periksa tab Network** untuk melihat request ke backend
3. **Periksa tab Console** untuk error JavaScript
4. **Periksa console browser** untuk error JavaScript

### Log Error Umum:

- **CORS Error:** Backend tidak mengizinkan request dari frontend
- **Connection Refused:** Backend tidak berjalan atau port salah
- **404 Not Found:** Endpoint tidak ada atau URL salah
- **500 Internal Server Error:** Error di backend, cek log backend
