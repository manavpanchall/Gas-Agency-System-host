import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';

function Cylinders() {
    const [cylinders, setCylinders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCylinders();
    }, []);

    async function fetchCylinders() {
        try {
            const { data } = await axios.get('/api/cylinders/getallcylinders');
            setCylinders(data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    async function deleteCylinder(cylinderid) {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.post('/api/cylinders/deletecylinder', { cylinderid });
                Swal.fire('Deleted!', 'Cylinder has been deleted.', 'success');
                fetchCylinders(); // Refresh the list
            }
        } catch (error) {
            console.error('Delete error:', error);
            Swal.fire('Error', 'Failed to delete cylinder', 'error');
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <h1>Cylinders</h1>
                {loading && <Loader />}
                {error && <Error message="Failed to fetch cylinders" />}
                
                <table className="table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th>Cylinder Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Weight</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.map(cylinder => (
                            <tr key={cylinder._id}>
                                <td>{cylinder._id}</td>
                                <td>{cylinder.name}</td>
                                <td>{cylinder.type}</td>
                                <td>{cylinder.weight}</td>
                                <td>{cylinder.price}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteCylinder(cylinder._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cylinders;