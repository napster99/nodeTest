var mysql = require('mysql'); 
// var client = new mysql.Client(); 
var db_options = {  
    host: 'localhost',  
    port: 3306,  
    user: 'root',  
    password: 'root',  
    database: 'bqcloud'  
};  
var client = mysql.createConnection(db_options);
client.query('select * from person',function selectCb(err, results, fields){
    console.log(results);
})