import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from '../components/Success';

function Registerscreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  async function register() {
    if (password == confirmpassword) {
      const user = {
        name,
        email,
        password,
        confirmpassword
      }
      try {
        setLoading(true);
        const result = await axios.post('/api/users/register', user);
        console.log(result.data);
        setLoading(false);
        setSuccess(true);

        setName('');
        setEmail('');
        setPassword('');
        setConfirmpassword('');

      } catch (error) {
        console.log(error)
        setLoading(false);
        setError(true);
      }
    }
    else {
      alert('password not matched')
    }
  }
  return (
    <div>
      {loading && (<Loader />)}
      {error && (<Error />)}
      {success && (<Success message='User Registered Successfully' />)}
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5 mt-5'>
          {success && (<Success message='User Registered Successfully' />)}
          <div className='bs'>
            <h2>Register</h2>
            <input type="text" className='form-control' placeholder='Name' value={name} onChange={(e) => { setName(e.target.value) }} />
            <input type="text" className='form-control' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <input type="text" className='form-control' placeholder='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <input type="text" className='form-control' placeholder='Confirm password' value={confirmpassword} onChange={(e) => { setConfirmpassword(e.target.value) }} />

            <button className='btn btn-primary mt-3' onClick={register}>register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registerscreen