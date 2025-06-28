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
      const response = await fetch('https://whiteboard-application-1.onrender.com/api/users/login', {
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
      const response = await fetch('https://whiteboard-application-1.onrender.com/api/users/register', {
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px 32px',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(31, 41, 55, 0.12)',
        minWidth: '350px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '24px', fontWeight: 700 }}>Login</h2>
        {error && <p style={{ color: '#e53e3e', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px',
                background: '#f1f5f9'
              }}
            />
          </div>
          <div style={{ marginBottom: '18px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px',
                background: '#f1f5f9'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
              color: 'white',
              padding: '12px 0',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '16px',
              width: '100%',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: '18px', color: '#64748b' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
            onClick={() => setShowRegister(true)}
          >
            Register here
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
                    background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
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
    </div>
  );
}

export default Login;