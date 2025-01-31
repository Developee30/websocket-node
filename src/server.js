const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Basic REST endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/test',(req,res)=>{
  res.json({status:'ok',message:'test new'})
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Example: Broadcasting a message every 5 seconds
  const intervalId = setInterval(() => {
    socket.emit('serverTime', { time: new Date().toISOString() });
  }, 5000);

  // Handle client messages
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Broadcast to all clients
    io.emit('broadcast', {
      from: socket.id,
      message: data
    });
  });

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('Client disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});