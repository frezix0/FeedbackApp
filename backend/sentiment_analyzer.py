from textblob import TextBlob

def analyze_sentiment(text: str, rating: int = None) -> str:
    """
    Analisis sentimen berdasarkan rating dengan kategori:
    - 1-2 bintang: negatif
    - 3 bintang: neutral
    - 4-5 bintang: positif
    """
    # Kata-kata positif dalam bahasa Indonesia
    positive_words = [
        'bagus', 'baik', 'sempurna', 'luar biasa', 'hebat', 'fantastis', 'memuaskan',
        'puas', 'senang', 'gembira', 'bahagia', 'terima kasih', 'terbaik', 'unggul',
        'profesional', 'ramah', 'cepat', 'efisien', 'bersih', 'nyaman', 'aman',
        'terpercaya', 'berkualitas', 'rekomendasi', 'suka', 'cinta', 'bangga',
        'mengagumkan', 'menakjubkan', 'sangat baik', 'sangat bagus', 'excellent',
        'wonderful', 'amazing', 'great', 'good', 'nice', 'perfect', 'satisfied'
    ]
    
    # Kata-kata negatif dalam bahasa Indonesia
    negative_words = [
        'buruk', 'jelek', 'sangat buruk', 'mengecewakan', 'kecewa', 'marah',
        'kesal', 'jengkel', 'sebel', 'tidak puas', 'tidak senang', 'sedih',
        'frustasi', 'stress', 'lelah', 'bosan', 'malas', 'lambat', 'kotor',
        'berantakan', 'tidak aman', 'mencurigakan', 'menipu', 'bodoh', 'tolol',
        'goblok', 'sial', 'celaka', 'sialan', 'kurang', 'tidak', 'gagal',
        'rusak', 'hancur', 'berantakan', 'kacau', 'berantakan', 'terlambat',
        'terlalu lama', 'mahal', 'mahal sekali', 'tidak worth it', 'waste',
        'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrating'
    ]
    
    # Konversi ke lowercase untuk pencarian yang lebih akurat
    text_lower = text.lower()
    
    # Hitung kata positif dan negatif
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    # Analisis menggunakan TextBlob sebagai backup
    analysis = TextBlob(text)
    textblob_polarity = analysis.sentiment.polarity
    
    # Jika ada rating, gunakan sebagai faktor utama sesuai kategori yang diminta
    if rating is not None:
        # Rating 1-2: negatif
        if rating <= 2:
            # Override dengan kata positif jika sangat kuat
            if positive_count > negative_count + 2:
                return "positif"
            else:
                return "negatif"
        
        # Rating 3: neutral
        elif rating == 3:
            # Jika ada kata yang sangat kuat, override
            if positive_count > negative_count + 1:
                return "positif"
            elif negative_count > positive_count + 1:
                return "negatif"
            else:
                return "neutral"
        
        # Rating 4-5: positif
        else:
            # Override dengan kata negatif jika sangat kuat
            if negative_count > positive_count + 2:
                return "negatif"
            else:
                return "positif"
    
    # Jika tidak ada rating, gunakan analisis teks
    if positive_count > negative_count:
        return "positif"
    elif negative_count > positive_count:
        return "negatif"
    elif textblob_polarity > 0.1:
        return "positif"
    elif textblob_polarity < -0.1:
        return "negatif"
    else:
        return "neutral"
