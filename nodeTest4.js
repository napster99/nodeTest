/**
 * String vs Buffer
 * @author morrisonleisure@163.com Napster
 */

var http = require('http')
	,string = ''
	,butter = new Buffer(16*1024);

if(false) {
	for (var i = 0; i < 16384; i++) {
		string += 'e';	
	}
}else{
	for(var i=0;i<butter.length; i++){
		butter[i]  =102;
	}
}


http.createServer(function(req,res) {
	res.writeHead(200);
	res.end(butter);
}).listen(8125);