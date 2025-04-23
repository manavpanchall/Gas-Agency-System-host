import React, { useState, useEffect } from 'react';
import { Tabs, Tag, message } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, [user]);

    const items = [
        {
            key: "1",
            label: "My Profile",
            children: (
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs">
                            <h1>My Profile</h1>
                            <h1>Name: {user?.name}</h1>
                            <h1>Email: {user?.email}</h1>
                            <h1>isAdmin: {user?.isAdmin ? 'YES' : 'NO'}</h1>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: "My Bookings",
            children: <MyBookings user={user} />,
        },
    ];

    return (
        <div className="ml-3 mt-3">
            <Tabs items={items} />
        </div>
    );
}

function MyBookings({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchBookings() {
            try {
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { 
                    userid: user._id 
                });
                if (isMounted) {
                    setBookings(response.data);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                if (isMounted) setError(error);
            } finally {
                setLoading(false);
            }
        }

        if (user && user._id) {
            fetchBookings();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    const cancelBooking = async (bookingId) => {
        try {
            setLoading(true);
            const result = await axios.post('/api/bookings/cancelbooking', { 
                bookingId 
            });

            if (result.data.success) {
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
                    )
                );
                Swal.fire('Success', 'Booking cancelled successfully', 'success');
            } else {
                Swal.fire('Error', result.data.message || 'Failed to cancel booking', 'error');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            Swal.fire('Error', 'Failed to cancel booking. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center"><p>Loading bookings...</p></div>;
    if (error) return <div className="alert alert-danger">Error loading bookings: {error.message}</div>;

    return (
        <div className='row'>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div className='col-md-6' key={booking._id}>
                        <div className='bs p-3 mb-3'>
                            <h4>{booking.cylinder}</h4>
                            <p><b>Booking ID:</b> {booking._id}</p>
                            <p><b>Date:</b> {new Date(booking.createdAt).toLocaleString()}</p>
                            <p><b>Weight:</b> {booking.weight}</p>
                            <p><b>Total Amount:</b> ₹{booking.totalAmount}</p>
                            <p><b>Status:</b> {' '}
                                <Tag color={booking.status === 'cancelled' ? 'red' : 'green'}>
                                    {booking.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}
                                </Tag>
                            </p>
                            {booking.status !== 'cancelled' && (
                                <button 
                                    className='btn btn-danger'
                                    onClick={() => cancelBooking(booking._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'CANCEL BOOKING'}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-center">
                    <p>No bookings found.</p>
                </div>
            )}
        </div>
    );
}

export default Profilescreen;