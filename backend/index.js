require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoute');
const canvasRoutes = require('./routes/canvasRoutes');
const Canvas = require('./models/canvasModel');
const User = require('./models/userModel');

const app = express();
connectToDatabase();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/canvas', canvasRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Helper: authenticate socket
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1];
  if (!token) return next(new Error('Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Unauthorized'));
    socket.user = decoded; // decoded should have { id, email }
    next();
  });
};

io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join canvas room
  socket.on('joinCanvas', async ({ canvasId }) => {
    try {
      const userId = socket.user.id; // from JWT
      const canvas = await Canvas.findById(canvasId);

      if (!canvas) {
        socket.emit('unauthorized', { message: 'Canvas not found' });
        return;
      }

      // Compare ObjectIds as strings
      const ownerId = canvas.owner.toString();
      const sharedWithIds = (canvas.shared_with || []).map(id => id.toString());

      if (
        ownerId !== userId &&
        !sharedWithIds.includes(userId)
      ) {
        socket.emit('unauthorized', { message: 'Access denied' });
        return;
      }

      socket.join(canvasId);
      socket.emit('loadCanvas', canvas); // Send latest canvas data
    } catch (err) {
      socket.emit('unauthorized', { message: 'Error joining canvas' });
    }
  });

  // Receive drawing updates from a client
  socket.on('drawingUpdate', async ({ canvasId, elements }) => {
    try {
      // Update DB
      await Canvas.findByIdAndUpdate(canvasId, { elements, updatedAt: new Date() });

      // Broadcast to all others in the room
      socket.to(canvasId).emit('receiveDrawingUpdate', { elements });
    } catch (err) {
      socket.emit('error', { message: 'Failed to update drawing' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3031;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});