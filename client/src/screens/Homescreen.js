import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

function Homescreen() {
    const [cylinders, setCylinders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKey, setSearchKey] = useState('');
    const [type, setType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedCylinder, setSelectedCylinder] = useState(null);

    useEffect(() => {
        const fetchCylinders = async () => {
            try {
                const { data } = await axios.get('/api/cylinders/getallcylinders');
                if (!Array.isArray(data)) {
                    console.error('Invalid data format:', data);
                    return []; // Return empty array as fallback
                }
                setCylinders(data);
            } catch (error) {
                console.error('Fetch error:', error);
                setCylinders([]); // Set empty array on error
            }
        };
        fetchCylinders();
    }, []);

    const filteredCylinders = Array.isArray(cylinders)
        ? cylinders.filter(cylinder => {
            const matchesSearch = cylinder.name.toLowerCase().includes(searchKey.toLowerCase());
            const matchesType = type === 'all' || cylinder.type.toLowerCase() === type.toLowerCase();
            return matchesSearch && matchesType;
        }) : [];

    const handleViewImages = (cylinder) => {
        setSelectedCylinder(cylinder);
        setShowImageModal(true);
    };

    return (
        <div className="container py-5">
            {/* Image View Modal */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCylinder?.name} Images</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedCylinder?.imageurls?.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            className="img-fluid mb-3 rounded"
                            alt={`${selectedCylinder?.name} - Image ${index + 1}`}
                            style={{ maxHeight: '400px', width: 'auto' }}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search cylinders..."
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter className="me-2" />
                        Filters
                    </button>

                    {showFilters && (
                        <div className="mt-2">
                            <select
                                className="form-select"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Error message={error} />
            ) : (
                <div className="row">
                    {filteredCylinders.length > 0 ? (
                        filteredCylinders.map(cylinder => (
                            <div key={cylinder._id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={cylinder.imageurls[0]}
                                        className="card-img-top"
                                        alt={cylinder.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{cylinder.name}</h5>
                                        <p className="card-text">
                                            <strong>Type:</strong> {cylinder.type}<br />
                                            <strong>Weight:</strong> {cylinder.weight}<br />
                                            <strong>Price:</strong> ₹{cylinder.price}
                                        </p>
                                        <div className="d-flex gap-2 mt-auto">
                                            <Link
                                                to={`/book/${cylinder._id}`}
                                                className="btn btn-primary flex-grow-1"
                                            >
                                                Book Now
                                            </Link>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handleViewImages(cylinder)}
                                                style={{ minWidth: '40px' }}
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h4>No cylinders found matching your criteria</h4>
                            <button
                                className="btn btn-link"
                                onClick={() => {
                                    setSearchKey('');
                                    setType('all');
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Homescreen;