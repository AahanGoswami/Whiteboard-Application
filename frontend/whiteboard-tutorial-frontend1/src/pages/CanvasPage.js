import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import BoardProvider from '../store/BoardProvider';
import ToolboxProvider from '../store/ToolboxProvider';
import Toolbar from '../components/Toolbar';
import Board from '../components/Board';
import Toolbox from '../components/Toolbox';

function CanvasPage() {
  const { id } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const socketRef = useRef(null);

  // Fetch canvas on mount (REST fallback)
  useEffect(() => {
    const fetchCanvas = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://whiteboard-application-1.onrender.com/api/canvas/load/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setCanvas(data);
          setElements(data.elements || []);
          setLoading(false);
        } else {
          setError(data.message || 'Failed to load canvas');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while loading canvas');
        setLoading(false);
      }
    };

    fetchCanvas();
  }, [id, token, navigate]);

  // WebSocket connection for this canvas
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    // Always disconnect previous socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io('https://whiteboard-application-1.onrender.com', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      // Only emit joinCanvas after socket is connected
      socketRef.current.emit('joinCanvas', { canvasId: id });
    });

    socketRef.current.on('loadCanvas', (data) => {
      setCanvas(data);
      setElements(data.elements || []);
      setLoading(false);
    });

    socketRef.current.on('receiveDrawingUpdate', ({ elements: newElements }) => {
      setElements(newElements);
    });

    socketRef.current.on('unauthorized', (msg) => {
      setError(msg.message || 'Unauthorized');
      setLoading(false);
      socketRef.current.disconnect();
      localStorage.removeItem('token');
      navigate('/login');
    });

    socketRef.current.on('disconnect', () => {
      // Optionally handle disconnect
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id, token, navigate]);

  // Send drawing updates to server
  const handleElementsChange = (newElements) => {
    setElements(newElements);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('drawingUpdate', { canvasId: id, elements: newElements });
    }
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (loading || !canvas) {
    return <p style={{ textAlign: 'center' }}>Loading canvas...</p>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <BoardProvider initialCanvas={canvas} elements={elements} onElementsChange={handleElementsChange}>
        <ToolboxProvider>
          <Toolbar />
          <Board />
          <Toolbox />
        </ToolboxProvider>
      </BoardProvider>
    </div>
  );
}

export default CanvasPage;