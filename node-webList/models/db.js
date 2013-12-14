var mongoose = require('mongoose'); //引用mongoose模块
var Schema = mongoose.Schema;
// var Db = require('mongodb').Db;

// var Connection = require('mongodb').Connection;
// var Server = require('mongodb').Server;

// module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT,{}));
var db = mongoose.createConnection('localhost','BFClub'); //创建一个数据库连接	
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  //一次打开记录
  console.log('连接MongoDB成功！');
});

exports.mongoose = mongoose;
// exports.db = db;
exports.Schema = Schema;