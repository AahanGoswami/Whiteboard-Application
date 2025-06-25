import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


function Profile() {
  const [profile, setProfile] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [error, setError] = useState(null);
  const [sharingCanvasId, setSharingCanvasId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [criticalShareError, setCriticalShareError] = useState('');
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3031/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProfile(data.user);
        } else {
          setError(data.message || 'Failed to fetch profile');
          navigate('/login');
        }
      } catch (err) {
        setError('An error occurred while fetching the profile');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const fetchCanvases = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3031/api/canvas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCanvases(data);
      } else {
        console.error(data.message || 'Failed to fetch canvases');
      }
    } catch (err) {
      console.error('An error occurred while fetching canvases');
    }
  }, [token]);

  useEffect(() => {
    fetchCanvases();
  }, [fetchCanvases]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleCreateCanvas = async () => {
    if (!newCanvasName.trim()) return;

    try {
      const response = await fetch('http://localhost:3031/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCanvasName }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewCanvasName('');
        fetchCanvases();
      } else {
        alert(data.message || 'Failed to create canvas');
      }
    } catch (err) {
      alert('An error occurred while creating canvas');
    }
  };

const handleOpenCanvas = (canvasId) => {
  navigate(`/canvas/${canvasId}`);
};

  const handleShareCanvas = async (canvasId) => {
    const token = localStorage.getItem('token');

    if (!shareEmail.trim()) {
      setCriticalShareError('Please enter an email.');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3031/api/canvas/share/${canvasId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shared_with: shareEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSharingCanvasId(null);
        setShareEmail('');
      } else {
        setCriticalShareError(data.message || 'An error occurred while sharing the canvas');
      }
    } catch (err) {
      setCriticalShareError('An error occurred while sharing the canvas');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  if (criticalShareError) {
    return (
      <div style={{
        backgroundColor: 'white',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '40px'
      }}>
        <div style={{
          color: 'brown',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          {criticalShareError}
        </div>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!profile) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello, {profile.name}!</h1>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={newCanvasName}
          onChange={(e) => setNewCanvasName(e.target.value)}
          placeholder="Enter canvas name"
          style={{
            padding: '8px',
            fontSize: '16px',
            marginRight: '10px',
            width: '250px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleCreateCanvas}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Canvas
        </button>
      </div>

      <h2>Your Canvases:</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px'
      }}>
        {canvases.length === 0 ? (
          <p>No canvases found.</p>
        ) : (
          canvases.map((canvas) => (
            <div key={canvas._id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '250px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3>{canvas.name}</h3>
              <p><strong>Created:</strong> {formatDate(canvas.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDate(canvas.updatedAt)}</p>

              <button
                onClick={() => handleOpenCanvas(canvas._id)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                Open Canvas
              </button>

              <button
                onClick={() => setSharingCanvasId(sharingCanvasId === canvas._id ? null : canvas._id)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {sharingCanvasId === canvas._id ? 'Cancel' : 'Share'}
              </button>

              {sharingCanvasId === canvas._id && (
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    style={{
                      padding: '6px',
                      width: '90%',
                      fontSize: '14px',
                      marginBottom: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <br />
                  <button
                    onClick={() => handleShareCanvas(canvas._id)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Share with Email
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;







