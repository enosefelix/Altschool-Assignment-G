var http = require('http');
const fs = require('fs');
const path = require('path');
var port = 8000;
const data = require('./index')

// server created
var server = http.createServer(data)
server.listen(port, () => {
    console.log(`Server running on localhost: ${port}`)
})

