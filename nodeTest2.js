/**
 * Number of times the cumulative access webpage in the file
 * @author morrisonleisure@163.com Napster
 */
 var http = require('http')
 	,fs   = require('fs');


 http.createServer(function(req, res){
 	console.log(req.url)
	fs.readFile('count.txt','utf-8',function(error,data){
		res.writeHead(200,{'Content-Type':'text/plain'});
		data = parseInt(data) + 1;
		fs.writeFile('count.txt',data);
		res.end('This page was refreshed '+ data + ' times!');
	});
 }).listen(8124);



