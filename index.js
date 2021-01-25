var fs = require('fs'),
  https = require('https'),
  express = require('express'),
  app = express();
 
https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(443);
 
app.get('/', function(req, res) {
  res.header('Content-type', 'text/html');
  return res.end('<h1>HTTPS WORKS!</h1>');
});