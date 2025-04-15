import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaFlask, FaBoxes, FaUsers } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Resources', value: '24', icon: <FaBook size={24} />, color: 'primary' },
    { title: 'Lab Bookings', value: '15', icon: <FaFlask size={24} />, color: 'success' },
    { title: 'Inventory Items', value: '48', icon: <FaBoxes size={24} />, color: 'warning' },
    { title: 'Active Users', value: '32', icon: <FaUsers size={24} />, color: 'info' },
  ];

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Welcome back, {user?.first_name || 'User'}!</h2>
        
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col key={index} md={3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className={`bg-${stat.color}-subtle border-${stat.color}`}>
                  <Card.Body className="d-flex align-items-center">
                    <div className={`me-3 text-${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <h6 className="mb-0">{stat.title}</h6>
                      <h4 className="mb-0">{stat.value}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="mt-4 g-4">
          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <Card.Title>Recent Activities</Card.Title>
              </Card.Header>
              <Card.Body>
                {/* Recent activities list would go here */}
                <p className="text-muted">No recent activities</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Body className="d-grid gap-2">
                <button className="btn btn-outline-primary">Request Resources</button>
                <button className="btn btn-outline-success">Book a Lab</button>
                <button className="btn btn-outline-info">View Inventory</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Dashboard;