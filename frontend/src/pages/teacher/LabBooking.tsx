import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert, Card, Container, Table, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Alert, Card, Container, Table, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface LabBooking {
  id: number;
  labNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected';
}

const LabBooking: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    labNumber: '',
    date: '',
    startTime: '',
    endTime: '',
    requirements: ''
  });
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableLabs, setAvailableLabs] = useState<string[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchAvailableLabs();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/labs/bookings/');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const fetchAvailableLabs = async () => {
    try {
      const response = await axios.get('/api/labs/available/');
      setAvailableLabs(response.data);
    } catch (err) {
      setError('Failed to fetch available labs');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('/api/labs/bookings/', {
        ...formData,
        teacher: user?.id
      });
      setSuccess('Lab booked successfully!');
      setFormData({
        labNumber: '',
        date: '',
        startTime: '',
        endTime: '',
        requirements: ''
      });
      fetchBookings();
      fetchAvailableLabs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to book lab. Please try again.');
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await axios.delete(`/api/labs/bookings/${id}/`);
      fetchBookings();
      fetchAvailableLabs();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="row">
          <div className="col-md-6 mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Book a Lab</h3>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="success">{success}</Alert>
                  </motion.div>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lab Number</Form.Label>
                    <Form.Select
                      name="labNumber"
                      value={formData.labNumber}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select lab</option>
                      {availableLabs.map(lab => (
                        <option key={lab} value={lab}>{lab}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <div className="row mb-3">
                    <Form.Group className="col-md-6">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="col-md-6">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="primary" type="submit" className="w-100">
                      <FaCalendarAlt className="me-2" />
                      Book Lab
                    </Button>
                  </motion.div>
                </Form>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-6">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Your Bookings</h3>
              </Card.Header>
              <Card.Body>
                {bookings.length === 0 ? (
                  <p className="text-muted">No bookings yet</p>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Lab</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{booking.labNumber}</td>
                            <td>{new Date(booking.date).toLocaleDateString()}</td>
                            <td>{booking.startTime} - {booking.endTime}</td>
                            <td>
                              {booking.status === 'approved' && (
                                <Badge bg="success">
                                  <FaCheck className="me-1" />
                                  Approved
                                </Badge>
                              )}
                              {booking.status === 'pending' && (
                                <Badge bg="warning" text="dark">
                                  Pending
                                </Badge>
                              )}
                              {booking.status === 'rejected' && (
                                <Badge bg="danger">
                                  <FaTimes className="me-1" />
                                  Rejected
                                </Badge>
                              )}
                            </td>
                            <td>
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => cancelBooking(booking.id)}
                                >
                                  Cancel
                                </Button>
                              )}
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
        </div>
      </motion.div>
    </Container>
  );
};

export default LabBooking;

interface LabBooking {
  id: number;
  labNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected';
}

const LabBooking: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    labNumber: '',
    date: '',
    startTime: '',
    endTime: '',
    requirements: ''
  });
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableLabs, setAvailableLabs] = useState<string[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchAvailableLabs();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/labs/bookings/');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const fetchAvailableLabs = async () => {
    try {
      const response = await axios.get('/api/labs/available/');
      setAvailableLabs(response.data);
    } catch (err) {
      setError('Failed to fetch available labs');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('/api/labs/bookings/', {
        ...formData,
        teacher: user?.id
      });
      setSuccess('Lab booked successfully!');
      setFormData({
        labNumber: '',
        date: '',
        startTime: '',
        endTime: '',
        requirements: ''
      });
      fetchBookings();
      fetchAvailableLabs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to book lab. Please try again.');
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await axios.delete(`/api/labs/bookings/${id}/`);
      fetchBookings();
      fetchAvailableLabs();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="row">
          <div className="col-md-6 mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Book a Lab</h3>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="success">{success}</Alert>
                  </motion.div>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lab Number</Form.Label>
                    <Form.Select
                      name="labNumber"
                      value={formData.labNumber}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select lab</option>
                      {availableLabs.map(lab => (
                        <option key={lab} value={lab}>{lab}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <div className="row mb-3">
                    <Form.Group className="col-md-6">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="col-md-6">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="primary" type="submit" className="w-100">
                      <FaCalendarAlt className="me-2" />
                      Book Lab
                    </Button>
                  </motion.div>
                </Form>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-6">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Your Bookings</h3>
              </Card.Header>
              <Card.Body>
                {bookings.length === 0 ? (
                  <p className="text-muted">No bookings yet</p>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Lab</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{booking.labNumber}</td>
                            <td>{new Date(booking.date).toLocaleDateString()}</td>
                            <td>{booking.startTime} - {booking.endTime}</td>
                            <td>
                              {booking.status === 'approved' && (
                                <Badge bg="success">
                                  <FaCheck className="me-1" />
                                  Approved
                                </Badge>
                              )}
                              {booking.status === 'pending' && (
                                <Badge bg="warning" text="dark">
                                  Pending
                                </Badge>
                              )}
                              {booking.status === 'rejected' && (
                                <Badge bg="danger">
                                  <FaTimes className="me-1" />
                                  Rejected
                                </Badge>
                              )}
                            </td>
                            <td>
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => cancelBooking(booking.id)}
                                >
                                  Cancel
                                </Button>
                              )}
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
        </div>
      </motion.div>
    </Container>
  );
};

export default LabBooking;