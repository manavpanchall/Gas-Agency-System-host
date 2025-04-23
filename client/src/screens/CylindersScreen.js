import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';


function CylindersScreen() {
    const [cylinders, setCylinders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCylinders();
    }, []);

    return (
        <div>
            <h2>Cylinders</h2>
            <ul>
                {cylinders.map(cylinder => (
                    <li key={cylinder._id}>{cylinder.name} - {cylinder.capacity}L - ${cylinder.price}</li>
                ))}
            </ul>
        </div>
    );
}

export default CylindersScreen;