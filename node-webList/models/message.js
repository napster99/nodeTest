var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;

function Message(mid, title, content, uid, time,clickCount,type) {
	this.mid = mid || '';
	this.mtitle = title;
	this.mcontent = content;
	this.uid = uid;
	this.mtime = time || +new Date();
	this.clickCount = clickCount;
	this.type = type || 'normal';
};

module.exports = Message;


Message.prototype.save = function save(message,callback) {
	//存入Mongodb的文档
	var message = {
		mtitle : message.mtitle,
		mcontent : message.mcontent,
		uid : message.uid,
		clickCount : message.clickCount,
		type : message.type || 'normal'
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
			collection.find({type:'normal'},function(data) {
				console.log(data)
			})
			collection.find({type:'normal'}).skip((page-1)*perCount).limit(perCount).toArray(function(err, data) {
				console.log(data)
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
			collection.find({type:'normal'}).count(function(err,count) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				return callback(err,count);
			})
		});
 	})
}


//通过mid获取单条消息内容
Message.getMessageByMid = function getMessageByMid(mid,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({_id:ObjectID(mid)},function(err,data) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				
				var timeStamp = new ObjectID(data['_id'].toString()).getTimestamp();
				var sTime = new Date(timeStamp).getTime();
				var obj = {
					'mtitle' : data['mtitle'],
					'mtime' : sTime,
					'mcontent' : data['mcontent'],
					'_id' : data['_id'],
					'uid' : data['uid']
				}
				return callback(err,obj);
			})
		});
 	})
}

//通过mid更改点击数
Message.updateMessagecNumByMid = function updateMessagecNumByMid(mid,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({_id:ObjectID(mid)},function(err,data) {
				if(err) {
					return callback(err);
				}
				console.log(mid)
				console.log(data['clickCount'])
				var count = parseInt(data['clickCount']) + 1;
				console.log(count)
				collection.update({_id:ObjectID(mid)},{$set:{clickCount:count}},false,true);
				mongodb.close();
				callback();
			})
		});
 	})
}



//根据第几页页数、uid 获得消息 日报 周报 列表
Message.getMessagesByMore = function getMessagesByMore(page,perCount,uid,type,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.find({uid:uid,type:type}).skip((page-1)*perCount).limit(perCount).toArray(function(err, data) {
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
						'uid' : data[i]['uid'],
						'mcontent' : data[i]['mcontent'],
						'type' : data[i]['type']
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


//获取消息总条数通过类型
Message.getMessagesCountByType = function getMessagesCount(type,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('messages',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.find({type:type}).count(function(err,count) {
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
