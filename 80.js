#!/usr/bin/env node
const sys = require('sys');
const http = require('http');
const net = require('net');
const fs = require('fs');

net.createServer((socket) => {
    socket.on("error", (err) =>{
            console.log("Caught flash policy server socket error: ");
            console.log(err.stack);
    });
    socket.write("<?xml version=\"1.0\"?>\n");
    socket.write("<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n");
    socket.write("<cross-domain-policy>\n");
    socket.write("<allow-access-from domain=\"*\" to-ports=\"*\"/>\n");
    socket.write("</cross-domain-policy>\n");
    socket.end();
    console.log('textClient connected');
    socket.on('data', (data) => {
        console.log(`Socket textData: ${data.toString()}`);
    });
    socket.on('end', () => {
        console.log('textClient disconnected');
    });
}).listen(80, () => {
    console.log('Socket server for text started on port 80');
});
