import React, { useState, useEffect, useCallback } from 'react';
import { Search, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import api from '../config/axios';
import StarRating from './StarRating';

const FeedbackList = ({ refreshTrigger }) => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchFeedback = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (sentimentFilter) params.append('sentiment', sentimentFilter);
            if (ratingFilter) params.append('rating', ratingFilter);
            params.append('sort_by', sortBy);
            params.append('sort_order', sortOrder);

            const response = await api.get(`/feedback?${params.toString()}`);
            setFeedback(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setError('Gagal memuat data feedback');
        } finally {
            setLoading(false);
        }
    }, [sentimentFilter, ratingFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback, refreshTrigger]); // Re-fetch when refreshTrigger changes

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchFeedback();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [fetchFeedback]);

    const filteredFeedback = feedback.filter(item => {
        const matchesSearch = searchTerm === '' ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    const getSentimentColor = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positif':
                return 'bg-green-100 text-green-800';
            case 'negatif':
                return 'bg-red-100 text-red-800';
            case 'neutral':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRatingStatus = (rating) => {
        switch (rating) {
            case 1: return { text: 'Sangat Buruk', color: 'bg-red-100 text-red-800', sentiment: 'negatif' };
            case 2: return { text: 'Buruk', color: 'bg-orange-100 text-orange-800', sentiment: 'negatif' };
            case 3: return { text: 'Biasa', color: 'bg-yellow-100 text-yellow-800', sentiment: 'neutral' };
            case 4: return { text: 'Baik', color: 'bg-blue-100 text-blue-800', sentiment: 'positif' };
            case 5: return { text: 'Sangat Baik', color: 'bg-green-100 text-green-800', sentiment: 'positif' };
            default: return { text: 'Tidak Ada', color: 'bg-gray-100 text-gray-800', sentiment: 'neutral' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={fetchFeedback}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Daftar Feedback</h2>
                    {lastUpdated && (
                        <div className="text-sm text-gray-500 mt-1">
                            Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                        </div>
                    )}
                </div>
                <button
                    onClick={fetchFeedback}
                    className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cari feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Sentiment Filter */}
                    <div>
                        <select
                            value={sentimentFilter}
                            onChange={(e) => setSentimentFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Semua Sentimen</option>
                            <option value="positif">Positif</option>
                            <option value="negatif">Negatif</option>
                            <option value="neutral">Netral</option>
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Semua Rating</option>
                            <option value="1">1 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="5">5 Bintang</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex space-x-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="created_at">Tanggal</option>
                            <option value="name">Nama</option>
                            <option value="rating">Rating</option>
                            <option value="sentiment">Sentimen</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg shadow-md">
                {filteredFeedback.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Tidak ada feedback yang ditemukan</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredFeedback.map((item) => {
                            const ratingStatus = getRatingStatus(item.rating);
                            // Gunakan sentimen dari backend, bukan dari rating
                            const displaySentiment = item.sentiment || ratingStatus.sentiment;
                            return (
                                <div key={item.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(displaySentiment)}`}>
                                                    {displaySentiment === 'positif' ? 'Positif' :
                                                        displaySentiment === 'negatif' ? 'Negatif' :
                                                            displaySentiment === 'neutral' ? 'Netral' : displaySentiment}
                                                </span>
                                            </div>

                                            {item.email && (
                                                <p className="text-sm text-gray-600 mb-2">{item.email}</p>
                                            )}

                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <StarRating
                                                        value={item.rating}
                                                        readOnly={true}
                                                        size={20}
                                                    />
                                                    <span className="text-sm text-gray-600">({item.rating}/5)</span>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${ratingStatus.color}`}>
                                                        {ratingStatus.text}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-800 leading-relaxed">{item.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{filteredFeedback.length}</p>
                        <p className="text-sm text-gray-600">Total Feedback</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {filteredFeedback.filter(f => f.sentiment === 'positif').length}
                        </p>
                        <p className="text-sm text-gray-600">Feedback Positif</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                            {filteredFeedback.filter(f => f.sentiment === 'negatif').length}
                        </p>
                        <p className="text-sm text-gray-600">Feedback Negatif</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {filteredFeedback.filter(f => f.sentiment === 'neutral').length}
                        </p>
                        <p className="text-sm text-gray-600">Feedback Netral</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackList; 