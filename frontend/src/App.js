import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';
import FeedbackList from './components/FeedbackList';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleFeedbackSubmitted = useCallback(() => {
        // Trigger refresh in all components
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />} />
                        <Route path="/dashboard" element={<Dashboard refreshTrigger={refreshTrigger} />} />
                        <Route path="/feedback" element={<FeedbackList refreshTrigger={refreshTrigger} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 