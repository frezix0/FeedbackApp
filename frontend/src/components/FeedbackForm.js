import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';
import api from '../config/axios';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 5,
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await api.post('/feedback', formData);
            console.log('Feedback submitted:', response.data);

            // Reset form
            setFormData({
                name: '',
                email: '',
                rating: 5,
                message: ''
            });

            setSubmitStatus('success');

            // Trigger refresh in parent components
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Form Feedback Pasien
                </h2>

                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <span className="text-green-700">Feedback berhasil dikirim!</span>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="text-red-700">Terjadi kesalahan saat mengirim feedback.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Masukkan email (opsional)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-between">
                            <StarRating
                                value={Number(formData.rating)}
                                onChange={(val) => setFormData(prev => ({ ...prev, rating: val }))}
                                max={5}
                                size={28}
                            />
                            <span className="text-lg font-semibold text-primary-600">
                                {formData.rating}/5
                            </span>
                        </div>
                        <div className="text-left mt-2">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${formData.rating === 1 ? 'bg-red-100 text-red-800' :
                                formData.rating === 2 ? 'bg-orange-100 text-orange-800' :
                                    formData.rating === 3 ? 'bg-yellow-100 text-yellow-800' :
                                        formData.rating === 4 ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                }`}>
                                {formData.rating === 1 ? 'Sangat Buruk' :
                                    formData.rating === 2 ? 'Buruk' :
                                        formData.rating === 3 ? 'Biasa' :
                                            formData.rating === 4 ? 'Baik' :
                                                'Sangat Baik'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Pesan Feedback <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Tuliskan feedback Anda tentang layanan kami..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-500 text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Mengirim...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Kirim Feedback</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm; 