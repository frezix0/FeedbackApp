#!/usr/bin/env python3
"""
Script untuk menambahkan data contoh ke database feedback
Jalankan script ini setelah backend berjalan untuk mengisi database dengan data contoh
"""

import requests
import json
from datetime import datetime
from backend.sentiment_analyzer import analyze_sentiment

# URL backend (pastikan backend berjalan di port 8000)
BASE_URL = "http://localhost:8000"

# Data contoh feedback
sample_feedback = [
    {
        "name": "Ahmad Rizki",
        "email": "ahmad.rizki@email.com",
        "rating": 5,
        "message": "Pelayanan sangat memuaskan! Dokter sangat ramah dan profesional. Saya sangat puas dengan perawatan yang diberikan."
    },
    {
        "name": "Siti Nurhaliza",
        "email": "siti.nurhaliza@email.com",
        "rating": 4,
        "message": "Fasilitas rumah sakit sangat baik dan bersih. Staff perawat sangat membantu. Hanya perlu perbaikan pada waktu tunggu."
    },
    {
        "name": "Budi Santoso",
        "email": "budi.santoso@email.com",
        "rating": 3,
        "message": "Pelayanan cukup baik, tapi ruang tunggu terlalu ramai. Dokter memberikan penjelasan yang jelas tentang kondisi saya."
    },
    {
        "name": "Dewi Sartika",
        "email": "dewi.sartika@email.com",
        "rating": 5,
        "message": "Pengalaman yang luar biasa! Dokter sangat teliti dalam mendiagnosis. Perawat sangat perhatian dan ramah."
    },
    {
        "name": "Rudi Hermawan",
        "email": "rudi.hermawan@email.com",
        "rating": 2,
        "message": "Saya tidak puas dengan pelayanan. Waktu tunggu terlalu lama dan staff kurang responsif. Harus ada perbaikan."
    },
    {
        "name": "Maya Indah",
        "email": "maya.indah@email.com",
        "rating": 4,
        "message": "Secara keseluruhan pelayanan bagus. Dokter kompeten dan fasilitas memadai. Hanya perlu perbaikan pada sistem antrian."
    },
    {
        "name": "Joko Widodo",
        "email": "joko.widodo@email.com",
        "rating": 1,
        "message": "Pelayanan sangat buruk! Dokter tidak profesional dan fasilitas kotor. Saya sangat kecewa dengan pengalaman ini."
    },
    {
        "name": "Sri Wahyuni",
        "email": "sri.wahyuni@email.com",
        "rating": 5,
        "message": "Terima kasih atas pelayanan yang excellent! Dokter sangat sabar menjelaskan dan perawat sangat caring. Sangat merekomendasikan!"
    },
    {
        "name": "Agus Setiawan",
        "email": "agus.setiawan@email.com",
        "rating": 3,
        "message": "Pelayanan standar, tidak ada yang istimewa. Dokter biasa saja, fasilitas cukup. Sesuai dengan harga yang dibayar."
    },
    {
        "name": "Nina Kartika",
        "email": "nina.kartika@email.com",
        "rating": 4,
        "message": "Saya puas dengan pelayanan yang diberikan. Dokter ramah dan fasilitas bersih. Akan kembali lagi jika diperlukan."
    }
]

def add_sample_data():
    """Menambahkan data contoh ke database"""
    print("Menambahkan data contoh ke database...")
    print("=" * 50)
    
    success_count = 0
    error_count = 0
    
    for i, feedback in enumerate(sample_feedback, 1):
        try:
            response = requests.post(f"{BASE_URL}/feedback", json=feedback)
            
            if response.status_code == 200:
                result = response.json()
                sentiment = result.get('sentiment', 'unknown')
                print(f"✓ Feedback {i}: {feedback['name']} - Rating: {feedback['rating']}/5 - Sentimen: {sentiment}")
                success_count += 1
            else:
                print(f"✗ Feedback {i}: Error {response.status_code} - {response.text}")
                error_count += 1
                
        except requests.exceptions.ConnectionError:
            print(f"✗ Feedback {i}: Tidak dapat terhubung ke backend. Pastikan backend berjalan di {BASE_URL}")
            error_count += 1
        except Exception as e:
            print(f"✗ Feedback {i}: Error - {str(e)}")
            error_count += 1
    
    print("=" * 50)
    print(f"Total berhasil: {success_count}")
    print(f"Total error: {error_count}")
    
    if success_count > 0:
        print(f"\nData contoh berhasil ditambahkan!")
        print(f"Silakan buka http://localhost:3000 untuk melihat aplikasi")
        print(f"Atau http://localhost:8000/docs untuk melihat dokumentasi API")
    else:
        print(f"\nGagal menambahkan data contoh. Pastikan backend berjalan di {BASE_URL}")

def check_backend_status():
    """Mengecek status backend"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            return True
        else:
            return False
    except:
        return False

if __name__ == "__main__":
    print("Feedback Analysis App - Sample Data Generator")
    print("=" * 50)
    
    # Cek status backend
    if check_backend_status():
        print("✓ Backend terhubung")
        add_sample_data()
    else:
        print("✗ Backend tidak dapat diakses")
        print(f"Pastikan backend berjalan di {BASE_URL}")
        print("Jalankan: cd backend && uvicorn main:app --reload") 