import { useState } from 'react';

import { useNavigate } from 'react-router-dom';



function Login() {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [showRegister, setShowRegister] = useState(false);

  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const [registerError, setRegisterError] = useState('');

  const [registerLoading, setRegisterLoading] = useState(false);



  const navigate = useNavigate();



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');



    try {

      const response = await fetch('http://localhost:3031/api/users/login', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email, password })

      });

      const data = await response.json();



      if (response.ok) {

        localStorage.setItem('token', data.token);

        navigate('/profile');

      } else {

        setError(data.message || data.error || 'Login failed');

      }

    } catch (err) {

      setError('An error occurred while logging in');

    }

  };



  const handleRegisterChange = (e) => {

    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  };



  const handleRegister = async (e) => {

    e.preventDefault();

    setRegisterError('');

    setRegisterLoading(true);



    try {

      const response = await fetch('http://localhost:3031/api/users/register', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(registerData)

      });

      const data = await response.json();



      if (response.ok) {

        setShowRegister(false);

        setRegisterData({ name: '', email: '', password: '' });

        setRegisterError('');

      } else {

        setRegisterError(data.message || data.error || 'Registration failed');

      }

    } catch (err) {

      setRegisterError('An error occurred while registering');

    }

    setRegisterLoading(false);

  };



  return (

    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center' }}>

      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '15px' }}>

          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            required

            style={{

              width: '100%',

              padding: '10px',

              border: '1px solid #ccc',

              borderRadius: '4px',

            }}

          />

        </div>

        <div style={{ marginBottom: '15px' }}>

          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            required

            style={{

              width: '100%',

              padding: '10px',

              border: '1px solid #ccc',

              borderRadius: '4px',

            }}

          />

        </div>

        <button

          type="submit"

          style={{

            backgroundColor: '#007BFF',

            color: 'white',

            padding: '10px 20px',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer',

          }}

        >

          Login

        </button>

      </form>

      <div style={{ marginTop: '20px' }}>

        <span>Don't have an account?{' '}

          <span

            style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}

            onClick={() => setShowRegister(true)}

          >

            Register here

          </span>

        </span>

      </div>



      {/* Registration Popup */}

      {showRegister && (

        <div style={{

          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',

          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000

        }}>

          <div style={{

            background: 'white', padding: '30px', borderRadius: '8px', minWidth: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'relative'

          }}>

            <button

              onClick={() => { setShowRegister(false); setRegisterError(''); }}

              style={{

                position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer'

              }}

              aria-label="Close"

            >×</button>

            <h3>Register</h3>

            {registerError && <p style={{ color: 'red' }}>{registerError}</p>}

            <form onSubmit={handleRegister}>

              <div style={{ marginBottom: '12px' }}>

                <input

                  type="text"

                  name="name"

                  placeholder="Name"

                  value={registerData.name}

                  onChange={handleRegisterChange}

                  required

                  style={{

                    width: '100%',

                    padding: '10px',

                    border: '1px solid #ccc',

                    borderRadius: '4px',

                  }}

                />

              </div>

              <div style={{ marginBottom: '12px' }}>

                <input

                  type="email"

                  name="email"

                  placeholder="Email"

                  value={registerData.email}

                  onChange={handleRegisterChange}

                  required

                  style={{

                    width: '100%',

                    padding: '10px',

                    border: '1px solid #ccc',

                    borderRadius: '4px',

                  }}

                />

              </div>

              <div style={{ marginBottom: '12px' }}>

                <input

                  type="password"

                  name="password"

                  placeholder="Password"

                  value={registerData.password}

                  onChange={handleRegisterChange}

                  required

                  style={{

                    width: '100%',

                    padding: '10px',

                    border: '1px solid #ccc',

                    borderRadius: '4px',

                  }}

                />

              </div>

              <button

                type="submit"

                disabled={registerLoading}

                style={{

                  backgroundColor: '#007BFF',

                  color: 'white',

                  padding: '10px 20px',

                  border: 'none',

                  borderRadius: '4px',

                  cursor: 'pointer',

                  width: '100%'

                }}

              >

                {registerLoading ? 'Registering...' : 'Register'}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}



export  default  Login; 