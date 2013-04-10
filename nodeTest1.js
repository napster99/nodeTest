/**
 * Get the link parameters
 * @author morrisonleisure@163.com Napster
 */
var http = require('http')
	,url = require('url');


http.createServer(function(req, res){
	var params = url.parse(req.url,true).query,
	str = '';
	for(var i in params){
		str +='参数名-->'+ i+'<br />参数值-->'+params[i]+'<br /><br />';
	}
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write('<meta charset="utf-8" />');
	res.end(str);

}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
