import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Table } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../../services/api';

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
        setError(''); // Clear error after successful fetch
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container className="py-4 fade-in">
      <Card className="mb-4">
        <Card.Header>
          <h3>Request Status Summary</h3>
        </Card.Header>
        <Card.Body>
          {reportData.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie
                data={reportData}
                dataKey="fulfilled"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {reportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <div className="text-center py-4">
              <p>No data available for the chart</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3>Recent Activities</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.action}</td>
                  <td>{activity.user}</td>
                  <td>{new Date(activity.date).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        activity.status === 'completed'
                          ? 'success'
                          : activity.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;