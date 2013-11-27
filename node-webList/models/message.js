var mongodb = require('./db');

function Message(mid, title, content, uid, time) {
	this.mid = mid || '';
	this.mtitle = title;
	this.mcontent = content;
	this.uid = uid;
	this.mtime = time || +new Date();
};

module.exports = Message;


Message.prototype.save = function save(message,callback) {
	//存入Mongodb的文档
	var message = {
		mtitle : message.mtitle,
		mcontent : message.mcontent,
		uid : message.uid
	};

	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		//读取posts集合
		db.collection('messages', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}

			//为Message属性添加索引
			collection.ensureIndex('Message');
			//写入message文档
			collection.insert(message, {safe : true}, function(err, message) {
				mongodb.close();
				callback(err, message);
			});
		});
	});
};

Message.getMessagesByPage = function getMessagesByPage(page,perCount,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// db.collection.find().skip((page-1)*perCount + 1).limit(perCount)
			collection.find({}, {limit: perCount, skip:(page-1)*perCount},function(err,data) {
				console.log('--------------')
				console.log(typeof data)
				console.log('22222222222222222')
			})
		});
 	})
}

// Post.get = function get(username, callback) {
	
// 	mongodb.open(function(err,db) {
// 		if(err) {
// 			return callback(err);
// 		}
// 		//读取posts集合
// 		db.collection('posts', function(err, collection) {
// 			if(err) {
// 				mongodb.close();
// 				return callback(err);
// 			}
			
// 			//查找user属性为username的文档，如果username是null则匹配全部
// 			var query = {};
// 			if(username) {
// 				query.user = username;
// 			}
// 			collection.find(query).sort({time : -1}).toArray(function(err,docs) {
// 				mongodb.close();
// 				if(err) {
// 					callback(err, null);
// 				}
				
// 				//封装posts为Post对象
// 				var posts = [];
// 				docs.forEach(function(doc, index) {
// 					var post = new Post(doc.user,doc.post,doc.time);
// 					posts.push(post);
// 				});
// 				callback(err,posts);
// 			});
// 		});
// 	});
// };

//  Post.getPostsByCount = function getPostsByCount(count, callback){
//  	mongodb.open(function(err,db) {
//  		if(err) {
//  			return callback(err);
//  		}

//  		db.collection('posts', function(err, collection) {
//  			if(err) {
//  				mongodb.close();
//  				return callback(err);
//  			}

//  			collection.find().sort({time : -1}).toArray(function(err, docs) {
//  				mongodb.close();
// 				if(err) {
// 					callback(err);
// 				} 				

// 				var posts = [];
// 				docs.forEach(function(doc, index) {
// 					var post = new Post(doc.user, doc.post, doc.time);
// 					posts.push(post);
// 				});
// 				if(posts.length >= count) {
// 					posts = posts.splice(0,count);
// 					callback('',posts);
// 				}else{
// 					callback('',posts);	
// 				}

				
//  			});

//  		});
//  	});
//  };



// //通过页数获取消息列表
// Post.getMessagesByPage = function getMessagesByPage(page, callback){
// 	mongodb.open(function(err,db) {
// 		if(err) {
// 			return callback(err);
// 		}
// 		db.collection('posts', function(err, collection) {
// 			if(err) {
// 				mongodb.close();
// 				return callback(err);
// 			}

// 			collection.find().sort({time : -1}).toArray(function(err, docs) {
// 				mongodb.close();
// 			if(err) {
// 				callback(err);
// 			} 				

// 			var posts = [];
// 			docs.forEach(function(doc, index) {
// 				var post = new Post(doc.user, doc.post, doc.time);
// 				posts.push(post);
// 			});
// 			if(posts.length >= count) {
// 				posts = posts.splice(0,count);
// 				callback('',posts);
// 			}else{
// 				callback('',posts);	
// 			}
// 			});
// 		});
// 	});
// };
