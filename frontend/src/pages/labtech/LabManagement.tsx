import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Container, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTools, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

interface LabBooking {
  id: number;
  labNumber: string;
  teacher: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

const LabManagement: React.FC = () => {
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<LabBooking | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/labs/bookings/');
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch lab bookings');
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.patch(`/api/labs/bookings/${id}/`, {
        status: 'approved'
      });
      fetchBookings();
    } catch (err) {
      setError('Failed to approve booking');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.patch(`/api/labs/bookings/${id}/`, {
        status: 'rejected'
      });
      fetchBookings();
    } catch (err) {
      setError('Failed to reject booking');
    }
  };

  const handleViewDetails = (booking: LabBooking) => {
    setCurrentBooking(booking);
    setNotes(booking.notes || '');
    setShowModal(true);
  };

  const handleSaveNotes = async () => {
    if (!currentBooking) return;
    
    try {
      await axios.patch(`/api/labs/bookings/${currentBooking.id}/`, {
        notes
      });
      fetchBookings();
      setShowModal(false);
    } catch (err) {
      setError('Failed to save notes');
    }
  };

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Lab Management</h3>
            <Badge bg="light" text="primary" pill>
              {bookings.length} Bookings
            </Badge>
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
                      <th>Lab</th>
                      <th>Teacher</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>{booking.labNumber}</td>
                        <td>{booking.teacher.name}</td>
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
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <FaInfoCircle />
                            </Button>
                            
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => handleApprove(booking.id)}
                                >
                                  <FaCheck />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <FaTimes />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
        
        {/* Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Lab Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentBooking && (
              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5>Lab Information</h5>
                    <p><strong>Lab Number:</strong> {currentBooking.labNumber}</p>
                    <p><strong>Date:</strong> {new Date(currentBooking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {currentBooking.startTime} - {currentBooking.endTime}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Teacher Information</h5>
                    <p><strong>Name:</strong> {currentBooking.teacher.name}</p>
                    <p><strong>Status:</strong> 
                      {currentBooking.status === 'approved' && (
                        <Badge bg="success" className="ms-2">
                          Approved
                        </Badge>
                      )}
                      {currentBooking.status === 'pending' && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          Pending
                        </Badge>
                      )}
                      {currentBooking.status === 'rejected' && (
                        <Badge bg="danger" className="ms-2">
                          Rejected
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h5>Requirements</h5>
                  <p>{currentBooking.requirements}</p>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>
                    <h5>Lab Technician Notes</h5>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about lab preparation..."
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default LabManagement;