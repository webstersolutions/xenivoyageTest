require('dotenv').config();

// import app from './src/index';
var app = require('./src/index')
let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

// app.all("*", function(req, res, next) {
//   setTimeout(function() {
//     next();
//   }, 20000); // 20 seconds
// });