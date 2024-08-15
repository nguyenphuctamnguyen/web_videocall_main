const { PeerServer } = require('peerjs-server');

const peerServer = PeerServer({ port: 9000, path: '/myapp' });
console.log('PeerServer is running on port 9000');