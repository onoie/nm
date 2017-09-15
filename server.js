#!/usr/bin/env node
const sys = require('sys');
const http = require('http');
const net = require('net');
const fs = require('fs');

var server = http.createServer(
    function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World!!');
        response.end();
    }
).listen(8080);
sys.log('Server running at http://localhost:8080/');

http.createServer((req, res) => {
  let source = "";
  req.on('data', function(data) {
    source += data;
  });
  req.on('end', function() {
    console.log(`Post data: ${source.toString()}`);
  });
}).listen(8080, '127.0.0.1', () => {
  console.log('Http server listening on port 8080 at host 127.0.0.1');
});

net.createServer((socket) => {
  console.log('textClient connected');
    socket.on('data', (data) => {
      console.log(`Socket textData: ${data.toString()}`);
    });
    socket.on('end', () => {
      console.log('textClient disconnected');
    });
}).listen(8081, () => {
  console.log('Socket server for text started on port 8081');
});

net.createServer((socket) => {
  console.log('imageClient connected');
  let imageSize = 0;
  let imageBufferArray = [];
  socket.on('data', (data) => {
    if (imageSize) {
      imageBufferArray.push(data);
        let imageData = Buffer.concat(imageBufferArray);
        if (imageData.byteLength >= imageSize) {
           fs.writeFile(`demo.jpg`, imageData, (err) => {
             console.log('Save socket image success');
             imageSize = 0;
             imageBufferArray = [];
           });
        }
      } else {
        imageSize = parseInt(data.toString());
        socket.write('1');
      }
  });
  socket.on('end', () => {
    console.log('imageClient disconnected');
  });
}).listen(8082, () => {
  console.log('Socket server for image started on port 8082');
});
