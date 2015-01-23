var http = require('http');
var fs = require('fs');
 
http.createServer(function(r, s) {
  var html = fs.readFileSync('./index.html').toString();
  if(!r.url.match(/lint/)) s.end(html);

  var d = '', s = s;
  r.on('data', function(chunk) {
      d+=chunk.toString();
  });
  r.on('end', function() {
      try{
        var options = JSON.parse(r.headers['x-options'] || '{}');
        var resp = {jserrors: lint(d, options)};
        s.writeHead(200, "OK", {'Content-Type': 'text/html'});
      } catch(e){
        s.writeHead(400, "", {'Content-Type': 'text/html'});
        resp = {"error": "You have sent an invalid request"};
      }
      s.write(JSON.stringify(resp, null, 2));
      s.end();
  });
}).listen(80);

var jshint = require("jshint").JSHINT;
function lint(d, o, s){
	jshint(d, o, null);
	return jshint.errors;
}
