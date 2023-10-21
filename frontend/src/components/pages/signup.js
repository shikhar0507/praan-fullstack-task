// Signup.js
import React, { useState } from 'react';
import AppAlert from '../common/alert'
import { useNavigate } from 'react-router-dom';
function Signup() {

  const [name, setName] = useState("")

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [alert, setAlert] = useState(false)

  const [alertConfig, setAlertConfig] = useState({
    type: '',
    label: '',
    message: ''
  })

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password)
    const path = process.env.api_base_url || 'http://localhost:80'
    fetch(`${path}/user/signup`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {

      return res.json()

    }).then((response) => {
      setAlert(true)
      console.log(response)

      if (response.status === 200) {

        setAlertConfig(prevState => ({
          ...prevState,
          type: 'success',
          label: 'Success',
          message: 'User created successfully'
        }))

        setTimeout(() => {
          navigate('/login')
        }, 2000)

      } else {
        setAlertConfig(prevState => ({
          ...prevState,
          type: 'failure',
          label: 'Error',
          message: response.message
        }))
      }

    })
      .catch(err => {
        console.error(err)
        setAlert(true)
        setAlertConfig(prevState => ({
          ...prevState,
          type: 'error',
          label: 'Error!',
          message: err
        }))
      })
  };

  return (
    <div>
      <div className="max-w-md mx-auto flex items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white'>Signup</div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" required />
            <p className="text-xs italic">Please Enter your email.</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" required />
            <p className="text-xs italic">Please Enter a password.</p>
          </div>
          <div className="flex items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[100%]" type="button" onClick={handleSubmit}>
              Sign Up
            </button>

          </div>
          <div className='mt-4'>
            {alert ? <AppAlert config={alertConfig}></AppAlert> : ''}

          </div>

        </form>
      </div>
    </div>


  );
}

export default Signup;
