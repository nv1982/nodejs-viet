const express = require('express');
const https = require('https'); // Thay đổi từ http sang https
const fs = require('fs'); // Thư viện để đọc chứng chỉ SSL
const socketIo = require('socket.io');

const app = express();

// Đọc chứng chỉ SSL từ tệp
const options = {
  key: fs.readFileSync('F:/BT_NODEJS/VOICE-VIDEO/192.168.1.96-key.pem'), // Update this path
    cert: fs.readFileSync('F:/BT_NODEJS/VOICE-VIDEO/192.168.1.96.pem') // Update this path
};

// Tạo máy chủ HTTPS
const server = https.createServer(options, app);
const io = socketIo(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Khởi động máy chủ trên cổng 443 (hoặc cổng mà bạn muốn)
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
