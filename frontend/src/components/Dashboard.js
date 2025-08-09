import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Star, MessageSquare, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../config/axios';
import StarRating from './StarRating';

const Dashboard = ({ refreshTrigger }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [previousTotal, setPreviousTotal] = useState(0);
    const [fixingSentiments, setFixingSentiments] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/feedback/analytics');
            const newData = response.data;

            // Check if there are new feedbacks
            if (analytics && newData.total_feedback > analytics.total_feedback) {
                const newFeedbacks = newData.total_feedback - analytics.total_feedback;
                console.log(`🆕 ${newFeedbacks} feedback baru ditambahkan!`);
            }

            setAnalytics(newData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Gagal memuat data analitik');
        } finally {
            setLoading(false);
        }
    };

    const fixSentiments = async () => {
        try {
            setFixingSentiments(true);
            const response = await api.put('/feedback/fix-sentiments');
            console.log('Sentimen diperbaiki:', response.data);

            // Refresh data setelah memperbaiki sentimen
            await fetchAnalytics();

            alert(`Berhasil memperbaiki sentimen untuk ${response.data.updated_count} feedback!`);
        } catch (error) {
            console.error('Error fixing sentiments:', error);
            alert('Gagal memperbaiki sentimen. Silakan coba lagi.');
        } finally {
            setFixingSentiments(false);
        }
    };

    const COLORS = ['#10B981', '#6B7280', '#EF4444']; // Green (positif), Gray (neutral), Red (negatif)

    const sentimentData = analytics ? Object.entries(analytics.sentiment_distribution).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value
    })) : [];

    const ratingData = analytics ? Object.entries(analytics.rating_distribution).map(([key, value]) => ({
        rating: `${key} Bintang`,
        count: value
    })) : [];

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
                    onClick={fetchAnalytics}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Analisis</h2>
                <div className="flex items-center space-x-4">
                    {lastUpdated && (
                        <div className="text-sm text-gray-500">
                            Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                        </div>
                    )}
                    <button
                        onClick={fixSentiments}
                        disabled={fixingSentiments}
                        className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {fixingSentiments ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Memperbaiki...</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={16} />
                                <span>Perbaiki Sentimen</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageSquare className="text-blue-600" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.total_feedback}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Rata-rata Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.average_rating}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Star className="text-green-600" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Feedback Positif</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.sentiment_distribution.positif || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Users className="text-gray-600" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Feedback Netral</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.sentiment_distribution.neutral || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Users className="text-red-600" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Feedback Negatif</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.sentiment_distribution.negatif || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Distribution Pie Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Sentimen</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Rating Distribution Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Rating</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ratingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback Terbaru</h3>
                <div className="space-y-4">
                    {analytics.recent_feedback.length > 0 ? (
                        analytics.recent_feedback.map((feedback) => (
                            <div key={feedback.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{feedback.name}</h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <StarRating
                                                value={feedback.rating}
                                                readOnly={true}
                                                size={16}
                                            />
                                            <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                                            <span className="text-sm text-gray-500">•</span>
                                            <span className="text-sm text-gray-600">Sentimen: {feedback.sentiment}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${feedback.sentiment === 'positif' ? 'bg-green-100 text-green-800' :
                                        feedback.sentiment === 'negatif' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {feedback.sentiment === 'positif' ? 'Positif' :
                                            feedback.sentiment === 'negatif' ? 'Negatif' :
                                                'Netral'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Belum ada feedback</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 