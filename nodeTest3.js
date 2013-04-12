/**
 * How to access the database
 * @author morrisonleisure@163.com Napster
 */
var mysql = require('mysql'); 
var db_options = {  
    host: 'localhost',  
    port: 3306,  
    user: 'root',  
    password: 'root' 
};  

var client = mysql.createConnection(db_options);

client.connect(function(error,results) {
	if(error){
		console.log('Connecting Error:'+error.message);
		return;
	}
	console.log('Connected to MySQL');
	ClientConnectionReady(client);
});	

ClientConnectionReady = function(client) {
	client.query('USE bqcloud',function(error,results) {
		if(error){
			console.log('ClientConnectionReady Error:'+error.message);
			client.end();
			return;
		}
		// ClientReady(client);
		GetData(client);
	});

};

// ClientReady = function(client) {
// 	var values = 
// }

GetData = function(client) {
	client.query(
		'select * from person',function selectCb(error,results,fields) {

			if(error){
				console.log('GetData Error:'+error.message);
				client.end();
				return;
			}

			if(results.length > 0){

				for(var i=0; i<results.length; i++){
					var firstResult = results[i];
					console.log('Account-->'+firstResult['account'] +' Password-->'+firstResult['password']+'  Nickname-->'+firstResult['nickname']);
				}

			}

		});
	client.end();
	console.log('Connection closed');
}

