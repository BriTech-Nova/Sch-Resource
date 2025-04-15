import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Form, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'last_updated'>>({
    name: '',
    category: 'stationery',
    quantity: 0,
    threshold: 5,
    department: 'general'
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'threshold' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedItems;
      if (formData.id) {
        // Update existing item
        const response = await api.put(`/store/inventory/${formData.id}/`, formData);
        updatedItems = items.map(item => 
          item.id === formData.id ? response.data : item
        );
      } else {
        // Add new item
        const response = await api.post('/store/inventory/', formData);
        updatedItems = [...items, response.data];
      }
      setItems(updatedItems);
      setShowForm(false);
      setFormData({
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

  const handleRestock = async (id: number) => {
    try {
      const response = await api.patch(`/store/inventory/${id}/restock/`, { amount: 10 });
      setItems(items.map(item => 
        item.id === id ? response.data : item
      ));
    } catch (err) {
      setError('Failed to restock item');
      console.error(err);
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
    // ... rest of the component remains the same, using the fetched items ...
  );
};

export default StockControl;