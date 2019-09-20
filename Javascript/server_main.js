var http = require('http');
var path = require('path');
var express = require('express');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});





/* Tutorial from w3 code

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
	if (req.url == '/fileupload') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			var oldpath = files.filetoupload.path;
			var newpath = 'C:/Users/Honza/' + files.filetoupload.name;
			fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
				res.write('File uploaded and moved!');
				res.end();
			});
		});
	} else {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
		res.write('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
	}
}).listen(8080);
*/