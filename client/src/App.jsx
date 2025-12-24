import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Assignment from './pages/Assignment';
import Reveal from './pages/Reveal';
import Admin from './pages/Admin';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />

                            {/* Private Routes */}
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Navbar />
                                        <Home />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/assignment"
                                element={
                                    <PrivateRoute>
                                        <Navbar />
                                        <Assignment />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/reveal"
                                element={
                                    <PrivateRoute>
                                        <Navbar />
                                        <Reveal />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Navbar />
                                        <div className="container mx-auto p-8">
                                            <div className="card">
                                                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                                                <p>Profile page - Coming soon!</p>
                                            </div>
                                        </div>
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <Navbar />
                                        <Admin />
                                    </AdminRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        {/* Toast Notifications */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
