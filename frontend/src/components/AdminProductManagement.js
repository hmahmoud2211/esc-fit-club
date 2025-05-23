import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Table,
    Button,
    Modal,
    Form,
    Alert
} from 'react-bootstrap';

const AdminProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: [],
        featured: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Convert price and stock to numbers, ensure images is array
        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
            images: Array.isArray(formData.images) ? formData.images : [formData.images],
        };

        try {
            const headers = {
                Authorization: `Bearer ${getAuthToken()}`
            };

            if (editingProduct) {
                // Update existing product
                await axios.put(
                    `http://localhost:5002/api/products/${editingProduct._id}`,
                    submitData,
                    { headers }
                );
                setSuccess('Product updated successfully');
            } else {
                // Create new product
                await axios.post(
                    'http://localhost:5002/api/products',
                    submitData,
                    { headers }
                );
                setSuccess('Product created successfully');
            }

            setShowModal(false);
            fetchProducts();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.msg || 'Operation failed');
        }
    };

    // Handle product deletion
    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5002/api/products/${productId}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` }
                });
                setSuccess('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product');
            }
        }
    };

    // Handle edit button click
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            images: product.images,
            featured: product.featured
        });
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            images: [],
            featured: false
        });
        setEditingProduct(null);
    };

    return (
        <Container className="mt-4">
            <h2>Product Management</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button 
                variant="primary" 
                className="mb-3"
                onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}
            >
                Add New Product
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.featured ? 'Yes' : 'No'}</td>
                            <td>
                                <Button 
                                    variant="warning" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URLs (one per line)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="images"
                                value={formData.images.join('\n')}
                                onChange={(e) => {
                                    const urls = e.target.value.split('\n').filter(url => url.trim());
                                    setFormData({
                                        ...formData,
                                        images: urls
                                    });
                                }}
                                placeholder="Enter image URLs, one per line"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Featured Product"
                                name="featured"
                                checked={formData.featured}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        featured: e.target.checked
                                    });
                                }}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminProductManagement; 