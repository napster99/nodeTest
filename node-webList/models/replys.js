var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectId = mongoose.Schema.Types.ObjectId;



// function Reply(mid, content, uid, time) {
// 	this.mid = mid || '';
// 	this.rcontent = content;
// 	this.uid = uid;
// 	this.rtime = time || +new Date();
// };


var replySchema = new Schema({
  mid:  String,
  rcontent: String,
  // mcontent:   String,
  uid    : String,
  rtime : {type:Date,default:Date.now}
});


replySchema.static('saveReply',function(reply,callback) {
	reply.save(function(err,reply) {
		console.log('===========')
		console.log(reply)
		console.log('===========')
		callback(err,reply);
	})
});

// Reply.prototype.save = function save(reply,callback) {
// 	//存入Mongodb的文档
// 	var reply = {
// 		mid : reply.mid,
// 		rcontent : reply.rcontent,
// 		uid : reply.uid
// 	};
	
// 	mongodb.open(function(err, db) {
// 		if(err) {
// 			return callback(err);
// 		}

// 		//读取posts集合
// 		db.collection('replys', function(err, collection) {
// 			if(err) {
// 				mongodb.close();
// 				return callback(err);
// 			}

// 			//为Message属性添加索引
// 			collection.ensureIndex('Reply');
// 			//写入message文档
// 			collection.insert(reply, {safe : true}, function(err, reply) {
// 				mongodb.close();
// 				callback(err, reply);
// 			});
// 		});
// 	});
// };

//根据消息id(数组)获得对应的回复数
replySchema.static('getReplysByMids',function(midsArr,callback) {
	// for(var i=0; i<midsArr.length; i++) {
	// 	midsArr[i] = midsArr[i].toString();
	// }
	return this.find({'mid':{$in:midsArr}},function(err,docs) {
		callback(err,docs);
	})
}) 

//根据消息id(数组)获得对应的回复数
// Reply.getReplysByMids = function getReplysByMids(midsArr,callback) {
// 	mongodb.open(function(err,db) {
// 		if(err) {
// 			return callback(err);
// 		}
// 		db.collection('replys',function(err,collection) {
// 			if(err) {
// 				mongodb.close();
// 				return callback(err);
// 			}
// 			// console.log('+++++++++')
// 			// console.log(midsArr)
// 			// console.log('+++++++++')
// 			for(var i=0; i<midsArr.length; i++) {
// 				midsArr[i] = midsArr[i].toString();
// 			}
// 			collection.find( { "mid" : { $in : midsArr } }).toArray(function(err,data) {
// 				mongodb.close();
// 				var dArr = [];
// 				for(var i=0; i<data.length; i++) {
// 					var timeStamp = new ObjectID(data[i]['_id'].toString()).getTimestamp();
// 					var sTime = new Date(timeStamp).getTime();
// 					var obj = {
// 						'rtime' : sTime,
// 						'rcontent' : data[i]['rcontent'],
// 						'mid' : data[i]['mid'],
// 						'uid' : data[i]['uid']
// 					}
// 					dArr.push(obj);
// 				}
// 				return callback(err,dArr)
// 			});
// 			// this.mid = mid || '';
// 			// this.rcontent = content;
// 			// this.uid = uid;
// 			// this.rtime = time || +new Date();

// 			// collection.find({mid:mid}).count(function(err,data) {
// 			// 	mongodb.close();
// 			// 	return callback(err,data);
// 			// })
// 			// collection.find({mid:mid}).toArray(function(err, data) {
// 			// 	if(err) {
// 			// 		mongodb.close();
// 			// 		return callback(err);
// 			// 	}
// 			// 	if(data instanceof Array) {
// 			// 		return callback(err,data.length);	
// 			// 	}
// 			// 	return callback(err,0);
// 			// })
// 		});
//  	})
// }

replySchema.static('getReplyCountByMid',function(mid,arrs) {
	var count = 0;
	for(var i=0; i<arrs.length; i++) {
		console.log([mid,arrs[i]['mid']])
		if(mid == arrs[i]['mid']) count++;
	}
	return count;
})

var Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;