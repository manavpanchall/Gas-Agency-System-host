import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

function Cylinder({ cylinder }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <img src={cylinder.imageurls[0]} className="img-fluid rounded" alt={cylinder.name} />
            </div>
            <div className="col-md-8">
                <h3>{cylinder.name}</h3>
                <div className="mb-3">
                    <p><strong>Price:</strong> ₹{cylinder.price}</p>
                    <p><strong>Weight:</strong> {cylinder.weight}</p>
                    <p><strong>Body Weight:</strong> {cylinder.bodyweight}</p>
                    <p><strong>Type:</strong> {cylinder.type}</p>
                </div>

                <div className="d-flex gap-2">
                    <Link to={`/book/${cylinder._id}`} className="btn btn-primary">
                        Book Now
                    </Link>
                    <Button variant="outline-primary" onClick={handleShow}>
                        <FaEye className="me-1" /> View Details
                    </Button>
                </div>
            </div>

            {/* Image Modal */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{cylinder.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img 
                        src={cylinder.imageurls[0]} 
                        className="img-fluid w-100 mb-3" 
                        alt={cylinder.name} 
                    />
                    <p>{cylinder.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Cylinder;