import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Container, Row, Col, Badge, Table, Alert } from 'react-bootstrap';
import { FaUsers, FaBook, FaFlask, FaBoxes, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    books: 0,
    labBookings: 0,
    inventoryItems: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, requestsRes] = await Promise.all([
        axios.get('/api/admin/stats/'),
        axios.get('/api/labs/bookings/recent/'),
        axios.get('/api/resources/requests/recent/')
      ]);
      
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
      setRecentRequests(requestsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Admin Dashboard</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Row className="g-4 mb-4">
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaUsers size={32} className="text-primary mb-3" />
                      <h3>{stats.teachers}</h3>
                      <p className="text-muted mb-0">Teachers</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaBook size={32} className="text-primary mb-3" />
                      <h3>{stats.books}</h3>
                      <p className="text-muted mb-0">Books in Library</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaFlask size={32} className="text-primary mb-3" />
                      <h3>{stats.labBookings}</h3>
                      <p className="text-muted mb-0">Lab Bookings</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
            
            <Row className="g-4 mb-4">
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaBoxes size={32} className="text-primary mb-3" />
                      <h3>{stats.inventoryItems}</h3>
                      <p className="text-muted mb-0">Inventory Items</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaChartLine size={32} className="text-primary mb-3" />
                      <h3>{stats.pendingRequests}</h3>
                      <p className="text-muted mb-0">Pending Requests</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="text-center">
                      <FaUsers size={32} className="text-primary mb-3" />
                      <h3>{stats.students}</h3>
                      <p className="text-muted mb-0">Students</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
            
            <Row className="g-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Recent Lab Bookings</h5>
                  </Card.Header>
                  <Card.Body>
                    {recentBookings.length === 0 ? (
                      <p className="text-muted">No recent bookings</p>
                    ) : (
                      <div className="table-responsive">
                        <Table striped hover>
                          <thead>
                            <tr>
                              <th>Lab</th>
                              <th>Teacher</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBookings.map(booking => (
                              <motion.tr
                                key={booking.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td>{booking.labNumber}</td>
                                <td>{booking.teacher.name}</td>
                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                <td>
                                  {booking.status === 'approved' && (
                                    <Badge bg="success">Approved</Badge>
                                  )}
                                  {booking.status === 'pending' && (
                                    <Badge bg="warning" text="dark">Pending</Badge>
                                  )}
                                  {booking.status === 'rejected' && (
                                    <Badge bg="danger">Rejected</Badge>
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
              </Col>
              
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Recent Resource Requests</h5>
                  </Card.Header>
                  <Card.Body>
                    {recentRequests.length === 0 ? (
                      <p className="text-muted">No recent requests</p>
                    ) : (
                      <div className="table-responsive">
                        <Table striped hover>
                          <thead>
                            <tr>
                              <th>Resource</th>
                              <th>Teacher</th>
                              <th>Qty</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentRequests.map(request => (
                              <motion.tr
                                key={request.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td>{request.resourceName}</td>
                                <td>{request.teacher.name}</td>
                                <td>{request.quantity}</td>
                                <td>
                                  {request.status === 'fulfilled' && (
                                    <Badge bg="success">Fulfilled</Badge>
                                  )}
                                  {request.status === 'pending' && (
                                    <Badge bg="warning" text="dark">Pending</Badge>
                                  )}
                                  {request.status === 'rejected' && (
                                    <Badge bg="danger">Rejected</Badge>
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
              </Col>
            </Row>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;