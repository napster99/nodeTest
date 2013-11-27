var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;

function Message(mid, title, content, uid, time,clickCount) {
	this.mid = mid || '';
	this.mtitle = title;
	this.mcontent = content;
	this.uid = uid;
	this.mtime = time || +new Date();
	this.clickCount = clickCount;
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

//根据第几页页数获得对应的消息列表
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
			collection.find().skip((page-1)*perCount).limit(perCount).toArray(function(err, data) {
				mongodb.close();
				var sData = [];
				for(var i=0; i<data.length; i++) {
					var timeStamp = new ObjectID(data[i]['_id'].toString()).getTimestamp();
					var sTime = new Date(timeStamp).getTime();
					var obj = {
						'clickCount' : data[i]['clickCount'] || 0,
						'mtitle' : data[i]['mtitle'],
						'mtime' : sTime,
						'_id' : data[i]['_id'],
						'uid' : data[i]['uid']
					}
					sData.push(obj);
				}
				if(err) {
					return callback(err);
				}
				callback(err,sData);
			})
		});
 	})
}


//获取消息总条数
Message.getMessagesCount = function getMessagesCount(callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.find().count(function(err,count) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				return callback(err,count);
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
