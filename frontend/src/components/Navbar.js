import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">SO Web</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {token ? (
                            <>
                                <Nav.Link as={Link} to="/admin/products">
                                    Manage Products
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar; 