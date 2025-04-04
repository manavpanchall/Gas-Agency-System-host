import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

function Bookingscreen() {
  const { cylinderid } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cylinder, setCylinder] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {

    if(!localStorage.getItem('currentUser')){
      window.location.reload = '/login'
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (
          await axios.post("/api/cylinders/getcylinderbyid", {
            cylinderid: cylinderid,
          })
        ).data;
        setCylinder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cylinder:', error.response ? error.response.data : error.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [cylinderid]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const bookCylinder = async (paymentId) => {
    if (!cylinder) {
      alert("Cylinder data is not available");
      return;
    }

    const { weight, bodyweight, price } = cylinder;
    const bookingDetails = {
      cylinder,
      userid: currentUser._id,
      totalAmount: quantity * price,
      totalcylinder: quantity,
      weight,
      bodyweight,
      transactionId: paymentId // Use paymentId as transactionId
    };

    try {
      const result = await axios.post("/api/bookings/bookcylinder", bookingDetails);
      Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: 'Your payment was successful and the booking is confirmed.',
      });
    } catch (error) {
      console.error('Error booking cylinder:', error.response ? error.response.data : error.message);
      alert("Booking Failed: " + (error.response ? error.response.data.message : error.message));
    }
  };

  const handlePayment = async () => {
    const totalAmount = quantity * cylinder.price;

    try {
      const order = await axios.post("/api/payment/create-order", { amount: totalAmount });
      const options = {
        key: 'rzp_test_DajLeiXU77hK6K', // Replace with your Razorpay key_id
        amount: order.data.amount,
        currency: order.data.currency,
        name: 'Gas Agency System',
        description: 'Cylinder Booking',
        order_id: order.data.id,
        handler: function (response) {
          console.log(response);
          bookCylinder(response.razorpay_payment_id);
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error.response ? error.response.data : error.message);
      alert("Payment Failed: " + (error.response ? error.response.data.message : error.message));
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  if (!cylinder) {
    return <div>No cylinder data available</div>;
  }

  const totalAmount = quantity * cylinder.price;

  return (
    <div className="m-5">
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-5">
          <h1>{cylinder.name}</h1>
          <img src={cylinder.imageurls[0]} className="bigimg" alt="Cylinder" />
        </div>

        <div className="col-md-5">
          <div style={{ textAlign: "right" }}>
            <h1>Booking Details</h1>
            <hr />
            <b>
              <p>Name: {currentUser.name}</p>
              <p>Weight: {cylinder.weight}</p>
              <p>Bodyweight: {cylinder.bodyweight}</p>
              <p>Price: {cylinder.price}</p>
            </b>
          </div>

          <div style={{ textAlign: "right" }}>
            <b>
              <h1>Payment Details</h1>
              <hr />
              <p>Total Cylinder:</p>
              <div className="input-group mb-3" style={{ maxWidth: "200px", margin: "0 auto" }}>
                <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>-</button>
                <input type="text" className="form-control text-center" value={quantity} readOnly />
                <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>+</button>
              </div>
              <p>Total Amount: {totalAmount}</p>
            </b>
          </div>

          <div style={{ float: "right" }}>
            <button className="btn btn-primary" onClick={handlePayment}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
