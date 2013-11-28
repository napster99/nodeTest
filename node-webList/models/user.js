var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.role = user.role;
	this.mobile = user.mobile;
	this.uid = user._id;
};

module.exports = User;

User.prototype.save = function save(callback) {
	//存入Mongodb文档
	var user = {
		name : this.name,
		password : this.password,
		mobile : this.mobile,
		role : this.role
	};

	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//为name属性添加索引
			collection.ensureIndex('name', {unique : true});
			//写入user文档
			collection.insert(user, {safe : true}, function(err, user) {
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

User.prototype.getUsers = function getUsers(callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				return callback(err);
			}
			//为name属性添加索引
			collection.find().toArray(function(error, datas){
				mongodb.close();
				callback(error,datas)
			});
		});
	});
};


User.prototype.getAdmins = function getAdmins(callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			
			collection.find({'role':'2'}).toArray(function(error, datas){
				mongodb.close();
				callback(error,datas)
			});
		});
	});
};

User.get = function get(password, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//查找password属性为username的文档
			collection.findOne({password : password}, function(err, doc) {
				mongodb.close();
				if(doc) {
					//封装文档为User对象
					var user = new User(doc);
					console.log('---------------------')
					console.log(doc)
					console.log('---------------------')
					callback(err,user);
				} else {
					callback(err,null);
				}
			});


		});
	});
}



User.set = function set(user,newPassword, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//查找password属性为username的文档
			collection.update({password : user['password']},{$set:{password:newPassword}},function(err, doc) {
				mongodb.close();
				console.log('===============')
				// if(doc) {
				// 	//封装文档为User对象
				// 	var user = new User(doc);
					callback();
				// } else {
				// 	callback(err,null);
				// }
			});


		});
	});
}



//通过uids（数组）获取用户信息
User.getUsersByUids = function getUsersByUids(uids, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		//读取users集合
		db.collection('users', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			for(var i=0; i<uids.length; i++) {
				uids[i] = ObjectID(uids[i]);
			}
			//查找password属性为username的文档	
			collection.find( { "_id" : { $in : uids } }).toArray(function(err,data) {
				mongodb.close();
				// console.log('+++++++++++')
				// console.log(data)
				// console.log('+++++++++++')
				return callback(err,data)
			});


		});
	});
}

//通过uid得到uname
User.getUsernameByUid = function getUsernameByUid(uid,users) {
	
	for(var i=0; i<users.length; i++) {
		if(uid == users[i]['_id']) return users[i]['name'];
	}
	return '';
}