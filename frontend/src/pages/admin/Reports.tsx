import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ReportData {
  name: string;
  pending: number;
  fulfilled: number;
  rejected: number;
}

interface Activity {
  id: number;
  action: string;
  user: string;
  date: string;
  status: string;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportRes, activitiesRes] = await Promise.all([
          api.get('/reports/summary/'),
          api.get('/activities/recent/')
        ]);
        setReportData(reportRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        setError('Failed to fetch report data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <Container className="py-4 fade-in">
      {/* ... rest of the component remains the same, just use reportData and activities from state ... */}
    </Container>
  );
};

export default Reports;