import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert, Card, Container } from 'react-bootstrap';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ResourceRequest: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    resourceType: '',
    resourceName: '',
    quantity: 1,
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('/api/resources/requests/', formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        name: user?.name || '',
        resourceType: '',
        resourceName: '',
        quantity: 1,
        description: ''
      });
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    }
  };

  return (
    <Container className="py-4 fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h3 className="mb-0">Resource Request</h3>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="success" className="d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  Request submitted successfully!
                </Alert>
              </motion.div>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Resource Type</Form.Label>
                <Form.Select
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select resource type</option>
                  <option value="stationery">Stationery</option>
                  <option value="equipment">Equipment</option>
                  <option value="furniture">Furniture</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Resource Name</Form.Label>
                <Form.Control
                  type="text"
                  name="resourceName"
                  value={formData.resourceName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Brief Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="primary" type="submit" className="w-100">
                  <FaPaperPlane className="me-2" />
                  Submit Request
                </Button>
              </motion.div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default ResourceRequest;