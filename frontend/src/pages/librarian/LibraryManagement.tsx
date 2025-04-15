
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Container, Table, Badge, Modal, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaBook, FaUser, FaSearch, FaCheck, FaTimes, FaExchangeAlt } from 'react-icons/fa';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
}

interface BorrowRecord {
  id: number;
  book: Book;
  borrower: { name: string; type: 'student' | 'teacher' };
  borrowedDate: string;
  dueDate: string;
  returned: boolean;
}

const LibraryManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'general',
    totalCopies: 1
  });
  const [borrowFormData, setBorrowFormData] = useState({
    borrowerName: '',
    borrowerType: 'student',
    dueDate: ''
  });

  const categories = ['general', 'fiction', 'non-fiction', 'science', 'history', 'reference'];

  useEffect(() => {
    fetchBooks();
    fetchBorrowRecords();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/library/books/');
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch books');
      setLoading(false);
    }
  };

  const fetchBorrowRecords = async () => {
    try {
      const response = await axios.get('/api/library/borrow-records/');
      setBorrowRecords(response.data);
    } catch (err) {
      setError('Failed to fetch borrow records');
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post('/api/library/books/', formData);
      fetchBooks();
      setShowAddModal(false);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'general',
        totalCopies: 1
      });
    } catch (err) {
      setError('Failed to add book');
    }
  };

  const handleBorrowBook = async () => {
    if (!currentBook) return;
    
    try {
      await axios.post('/api/library/borrow-records/', {
        book: currentBook.id,
        borrowerName: borrowFormData.borrowerName,
        borrowerType: borrowFormData.borrowerType,
        dueDate: borrowFormData.dueDate
      });
      fetchBooks();
      fetchBorrowRecords();
      setShowBorrowModal(false);
      setBorrowFormData({
        borrowerName: '',
        borrowerType: 'student',
        dueDate: ''
      });
    } catch (err) {
      setError('Failed to borrow book');
    }
  };

  const handleReturnBook = async (recordId: number) => {
    try {
      await axios.patch(`/api/library/borrow-records/${recordId}/`, {
        returned: true
      });
      fetchBooks();
      fetchBorrowRecords();
    } catch (err) {
      setError('Failed to return book');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' ? parseInt(value) || 0 : value
    }));
  };

  const handleBorrowFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBorrowFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const activeBorrows = borrowRecords.filter(record => !record.returned);
  const returnedBorrows = borrowRecords.filter(record => record.returned);

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Library Management</h3>
            <Button
              variant="light"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <FaBook className="me-1" />
              Add Book
            </Button>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="d-flex mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search books by title, author or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
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
                      <th>Title</th>
                      <th>Author</th>
                      <th>ISBN</th>
                      <th>Category</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map(book => (
                      <motion.tr
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.isbn}</td>
                        <td className="text-capitalize">{book.category}</td>
                        <td>
                          {book.availableCopies > 0 ? (
                            <Badge bg="success">
                              {book.availableCopies} available
                            </Badge>
                          ) : (
                            <Badge bg="danger">
                              Out of stock
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={book.availableCopies === 0}
                            onClick={() => {
                              setCurrentBook(book);
                              setShowBorrowModal(true);
                            }}
                          >
                            <FaUser className="me-1" />
                            Lend
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h3 className="mb-0">Borrow Records</h3>
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey="active" className="mb-3">
              <Tab eventKey="active" title="Active Borrows">
                <div className="table-responsive mt-3">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Borrower</th>
                        <th>Borrowed Date</th>
                        <th>Due Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBorrows.map(record => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>{record.book.title}</td>
                          <td>
                            {record.borrower.name}
                            <Badge bg="info" className="ms-2">
                              {record.borrower.type}
                            </Badge>
                          </td>
                          <td>{new Date(record.borrowedDate).toLocaleDateString()}</td>
                          <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleReturnBook(record.id)}
                            >
                              <FaExchangeAlt className="me-1" />
                              Return
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              <Tab eventKey="returned" title="Returned Books">
                <div className="table-responsive mt-3">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Borrower</th>
                        <th>Borrowed Date</th>
                        <th>Returned Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnedBorrows.map(record => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>{record.book.title}</td>
                          <td>
                            {record.borrower.name}
                            <Badge bg="info" className="ms-2">
                              {record.borrower.type}
                            </Badge>
                          </td>
                          <td>{new Date(record.borrowedDate).toLocaleDateString()}</td>
                          <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
        
        {/* Add Book Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Add New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  name="isbn"
                  value={formData.isbn}
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
                <Form.Label>Total Copies</Form.Label>
                <Form.Control
                  type="number"
                  name="totalCopies"
                  min="1"
                  value={formData.totalCopies}
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
            <Button variant="primary" onClick={handleAddBook}>
              Add Book
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Borrow Book Modal */}
        <Modal show={showBorrowModal} onHide={() => setShowBorrowModal(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Lend Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentBook && (
              <div className="mb-3">
                <h5>{currentBook.title}</h5>
                <p className="text-muted">by {currentBook.author}</p>
                <p>Available copies: {currentBook.availableCopies}</p>
              </div>
            )}
            
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Borrower Name</Form.Label>
                <Form.Control
                  type="text"
                  name="borrowerName"
                  value={borrowFormData.borrowerName}
                  onChange={handleBorrowFormChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Borrower Type</Form.Label>
                <Form.Select
                  name="borrowerType"
                  value={borrowFormData.borrowerType}
                  onChange={handleBorrowFormChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={borrowFormData.dueDate}
                  onChange={handleBorrowFormChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBorrowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBorrowBook}>
              Lend Book
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default LibraryManagement;