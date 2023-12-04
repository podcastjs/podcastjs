const express = require('express');
const path = require('path');
var app = express();

// set the port of our application
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(path.join(process.env.INIT_CWD,"theme")));

// set the home page route
app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.listen(port, function() {
    console.log('Our app is running on ' + port);
});