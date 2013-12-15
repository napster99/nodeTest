var mongoose = require('mongoose'); //引用mongoose模块
var Schema = mongoose.Schema;
// var Db = require('mongodb').Db;

// var Connection = require('mongodb').Connection;
// var Server = require('mongodb').Server;

// module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT,{}));
var db = mongoose.connect('mongodb://localhost/NAP'); //创建一个数据库连接	

var Comments = new Schema({
    title     : String
  , body      : String
});

Comments.static('saveUser',function(user,callback) {
	user.save(function(err,user) {
		callback(err,user);
	})
})

var User = mongoose.model('Comments', Comments);


var user = new User({
	title : 'aaa',
	body : 'xxxxxxxxxx'
})


User.saveUser(user,function(err,user) {
	console.log(err)
	console.log(user);
})



