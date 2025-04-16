import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Container, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  department: string;
  lastRestocked: string;
}

interface ResourceRequest {
  id: number;
  teacher: { name: string };
  resourceType: string;
  resourceName: string;
  quantity: number;
  description: string;
  status: 'pending' | 'fulfilled' | 'rejected';
}

const StoreManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ResourceRequest | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'stationery',
    quantity: 0,
    threshold: 5,
    department: 'general'
  });

  const categories = ['stationery', 'equipment', 'furniture', 'other'];
  const departments = ['general', 'science', 'math', 'english', 'history', 'arts'];

  useEffect(() => {
    fetchInventory();
    fetchRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/store/inventory/');
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch inventory');
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/resources/requests/');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch resource requests');
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/api/store/inventory/', formData);
      fetchInventory();
      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'stationery',
        quantity: 0,
        threshold: 5,
        department: 'general'
      });
    } catch (err) {
      setError('Failed to add item');
    }
  };

  const handleFulfillRequest = async (id: number) => {
    try {
      await axios.patch(`/api/resources/requests/${id}/`, {
        status: 'fulfilled'
      });
      fetchRequests();
    } catch (err) {
      setError('Failed to fulfill request');
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      await axios.patch(`/api/resources/requests/${id}/`, {
        status: 'rejected'
      });
      fetchRequests();
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  const handleViewRequest = (request: ResourceRequest) => {
    setCurrentRequest(request);
    setShowRequestModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'threshold' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="row">
          <div className="col-md-8">
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Inventory Management</h3>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Item
                </Button>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Category</th>
                          <th>Department</th>
                          <th>Quantity</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map(item => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{item.name}</td>
                            <td>
                              <Badge bg="secondary" className="text-capitalize">
                                {item.category}
                              </Badge>
                            </td>
                            <td className="text-capitalize">{item.department}</td>
                            <td>
                              {item.quantity}
                              {item.quantity <= item.threshold && (
                                <Badge bg="warning" text="dark" className="ms-2">
                                  Low Stock
                                </Badge>
                              )}
                            </td>
                            <td>
                              {new Date(item.lastRestocked).toLocaleDateString()}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-4">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Resource Requests</h3>
              </Card.Header>
              <Card.Body>
                {requests.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-muted">No pending requests</p>
                ) : (
                  <div className="d-grid gap-3">
                    {requests.filter(r => r.status === 'pending').map(request => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{request.resourceName}</h6>
                              <Badge bg="warning" text="dark">
                                Pending
                              </Badge>
                            </div>
                            <p className="small text-muted mb-2">
                              Requested by: {request.teacher.name}
                            </p>
                            <p className="small mb-2">
                              <strong>Qty:</strong> {request.quantity} | 
                              <strong> Type:</strong> {request.resourceType}
                            </p>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleFulfillRequest(request.id)}
                              >
                                <FaCheck className="me-1" />
                                Fulfill
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                Details
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
        
        {/* Add Item Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Add Inventory Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Low Stock Threshold</Form.Label>
                <Form.Control
                  type="number"
                  name="threshold"
                  min="1"
                  value={formData.threshold}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddItem}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Request Details Modal */}
        <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentRequest && (
              <div>
                <h5>{currentRequest.resourceName}</h5>
                <p className="text-muted">Requested by: {currentRequest.teacher.name}</p>
                
                <div className="mb-3">
                  <p><strong>Type:</strong> {currentRequest.resourceType}</p>
                  <p><strong>Quantity:</strong> {currentRequest.quantity}</p>
                  <p><strong>Status:</strong> 
                    {currentRequest.status === 'pending' && (
                      <Badge bg="warning" text="dark" className="ms-2">
                        Pending
                      </Badge>
                    )}
                    {currentRequest.status === 'fulfilled' && (
                      <Badge bg="success" className="ms-2">
                        Fulfilled
                      </Badge>
                    )}
                    {currentRequest.status === 'rejected' && (
                      <Badge bg="danger" className="ms-2">
                        Rejected
                      </Badge>
                    )}
                  </p>
                </div>
                
                <div>
                  <h6>Description:</h6>
                  <p>{currentRequest.description || 'No additional description provided.'}</p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default StoreManagement;