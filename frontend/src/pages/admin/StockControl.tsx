import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../../services/api';
// import { useAuth } from '../../context/AuthContext';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  department: string;
  last_updated: string;
}

const StockControl: React.FC = () => {
  // Remove unused user variable or add eslint-disable if you'll need it later
   //const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    id: undefined,
    name: '',
    category: 'stationery',
    quantity: 0,
    threshold: 5,
    department: 'general'
  });
  const [restocking, setRestocking] = useState<number | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/store/inventory/');
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch inventory');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Update the type to include HTMLTextAreaElement
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'threshold' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let updatedItems;
      if (formData.id) {
        const response = await api.put(`/store/inventory/${formData.id}/`, formData);
        updatedItems = items.map(item =>
          item.id === formData.id ? response.data : item
        );
      } else {
        const response = await api.post('/store/inventory/', formData);
        updatedItems = [...items, response.data];
      }
      setItems(updatedItems);
      setShowForm(false);
      setFormData({
        id: undefined,
        name: '',
        category: 'stationery',
        quantity: 0,
        threshold: 5,
        department: 'general'
      });
    } catch (err) {
      setError('Failed to save inventory item');
      console.error(err);
    }
  };

  const handleRestock = async (id: number, amount: number) => {
    setRestocking(id);
    try {
      const response = await api.patch(`/store/inventory/${id}/restock/`, { amount });
      setItems(items.map(item =>
        item.id === id ? response.data : item
      ));
    } catch (err) {
      setError('Failed to restock item');
      console.error(err);
    } finally {
      setRestocking(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h3 className="mb-0">Inventory Management</h3>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close Form' : 'Add New Item'}
            </Button>
            {showForm && (
              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="stationery">Stationery</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity || 0}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Threshold</Form.Label>
                  <Form.Control
                    type="number"
                    name="threshold"
                    value={formData.threshold || 0}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Save Item
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Threshold</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  {item.quantity}{' '}
                  {item.quantity < item.threshold && (
                    <Badge bg="danger">Low Stock</Badge>
                  )}
                </td>
                <td>{item.threshold}</td>
                <td>{item.department}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleRestock(item.id, 10)}
                    disabled={restocking === item.id}
                  >
                    {restocking === item.id ? <Spinner as="span" animation="border" size="sm" /> : 'Restock'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </motion.div>
    </Container>
  );
};

export default StockControl;