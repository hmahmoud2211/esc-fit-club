import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AdminProductManagement from './components/AdminProductManagement';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Navbar />
            <Container>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/admin/products" 
                        element={
                            <ProtectedRoute>
                                <AdminProductManagement />
                            </ProtectedRoute>
                        } 
                    />
                    {/* Add more routes as needed */}
                </Routes>
            </Container>
        </Router>
    );
}

export default App; 