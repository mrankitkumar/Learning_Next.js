'use client';

import React, { useState, useEffect } from 'react';
import supabase from './lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PencilSquare } from 'react-bootstrap-icons';

const Page = () => {
  const [view, setView] = useState('home'); // Tracks current view: 'home', 'login', 'signup', 'shipments', 'addShipment'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newShipment, setNewShipment] = useState({
    tracking_number: '',
    customer_name: '',
    invoice_number: '',
    customer_number: '',
  });
  const [editShipment, setEditShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (view === 'shipments') {
      fetchShipments();
    }
  }, [view]);

  // Handle user signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      setError('');
      setView('login');
    }
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      setError('');
      setView('shipments');
    }
  };

  // Fetch shipment data from Supabase
  const fetchShipments = async () => {
    const { data, error } = await supabase
      .from('shipments')
      .select('*');
    if (error) setError(error.message);
    else setShipments(data);
  };

  // Handle adding a new shipment
  const handleAddShipment = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('shipments')
      .insert([newShipment]);
    if (error) setError(error.message);
    else {
      setNewShipment({
        tracking_number: '',
        customer_name: '',
        invoice_number: '',
        customer_number: '',
      });
      fetchShipments(); // Update the list of shipments after adding a new one
    }
  };

  // Handle editing a shipment
  const handleEditShipment = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('shipments')
      .update(editShipment)
      .eq('id', editShipment.id);
    if (error) setError(error.message);
    else {
      setShowModal(false);
      fetchShipments();
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Side Panel */}
      {view === 'shipments' && (
        <div style={{ width: '20%', background: '#f0f0f0', padding: '10px', overflowY: 'auto' }}>
          <h2>Shipments</h2>
          <Button variant="primary" onClick={() => setView('addShipment')}>Add Shipment</Button>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer Name</th>
                <th>Invoice Number</th>
                <th>Customer Number</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id} onClick={() => setSelectedShipment(shipment)}>
                  <td>{shipment.tracking_number}</td>
                  <td>{shipment.customer_name}</td>
                  <td>{shipment.invoice_number}</td>
                  <td>{shipment.customer_number}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditShipment(shipment);
                        setShowModal(true);
                      }}
                    >
                      <PencilSquare />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Details Panel */}
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {view === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h1>Welcome to the Shipment App</h1>
            <Button variant="primary" onClick={() => setView('login')}>Log In</Button>
            <Button variant="secondary" onClick={() => setView('signup')}>Sign Up</Button>
          </div>
        )}

        {view === 'login' && (
          <div style={{ textAlign: 'center' }}>
            <h1>Login</h1>
            <Form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Log In
              </Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button variant="link" onClick={() => setView('home')}>Back to Home</Button>
          </div>
        )}

        {view === 'signup' && (
          <div style={{ textAlign: 'center' }}>
            <h1>Sign Up</h1>
            <Form onSubmit={handleSignup} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Sign Up
              </Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button variant="link" onClick={() => setView('home')}>Back to Home</Button>
          </div>
        )}

        {view === 'addShipment' && (
          <div style={{ textAlign: 'center' }}>
            <h1>Add Shipment</h1>
            <Form onSubmit={handleAddShipment} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Form.Group controlId="formTrackingNumber">
                <Form.Label>Tracking Number:</Form.Label>
                <Form.Control
                  type="text"
                  value={newShipment.tracking_number}
                  onChange={(e) => setNewShipment({ ...newShipment, tracking_number: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCustomerName">
                <Form.Label>Customer Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={newShipment.customer_name}
                  onChange={(e) => setNewShipment({ ...newShipment, customer_name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formInvoiceNumber">
                <Form.Label>Invoice Number:</Form.Label>
                <Form.Control
                  type="text"
                  value={newShipment.invoice_number}
                  onChange={(e) => setNewShipment({ ...newShipment, invoice_number: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCustomerNumber">
                <Form.Label>Customer Number:</Form.Label>
                <Form.Control
                  type="text"
                  value={newShipment.customer_number}
                  onChange={(e) => setNewShipment({ ...newShipment, customer_number: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Add Shipment
              </Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button variant="link" onClick={() => setView('shipments')}>Back to Shipments</Button>
          </div>
        )}

        {view === 'shipments' && selectedShipment && (
          <div style={{ textAlign: 'center' }}>
            <h1>Shipment Details</h1>
            <p><strong>Tracking Number:</strong> {selectedShipment.tracking_number}</p>
            <p><strong>Customer Name:</strong> {selectedShipment.customer_name}</p>
            <p><strong>Invoice Number:</strong> {selectedShipment.invoice_number}</p>
            <p><strong>Customer Number:</strong> {selectedShipment.customer_number}</p>
            <Button onClick={() => {
              setEditShipment(selectedShipment);
              setShowModal(true);
            }}>Edit</Button>
          </div>
        )}
      </div>

      {/* Edit Shipment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Shipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditShipment}>
            <Form.Group controlId="formEditTrackingNumber">
              <Form.Label>Tracking Number:</Form.Label>
              <Form.Control
                type="text"
                value={editShipment?.tracking_number || ''}
                onChange={(e) => setEditShipment({ ...editShipment, tracking_number: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditCustomerName">
              <Form.Label>Customer Name:</Form.Label>
              <Form.Control
                type="text"
                value={editShipment?.customer_name || ''}
                onChange={(e) => setEditShipment({ ...editShipment, customer_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditInvoiceNumber">
              <Form.Label>Invoice Number:</Form.Label>
              <Form.Control
                type="text"
                value={editShipment?.invoice_number || ''}
                onChange={(e) => setEditShipment({ ...editShipment, invoice_number: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEditCustomerNumber">
              <Form.Label>Customer Number:</Form.Label>
              <Form.Control
                type="text"
                value={editShipment?.customer_number || ''}
                onChange={(e) => setEditShipment({ ...editShipment, customer_number: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Page;
