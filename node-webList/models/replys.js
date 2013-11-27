var mongodb = require('./db');

function Reply(mid, title, content, uid, time) {
	this.mid = mid || '';
	this.rcontent = content;
	this.uid = uid;
	this.rtime = time || +new Date();
};

module.exports = Reply;


Reply.prototype.save = function save(message,callback) {
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
			collection.ensureIndex('Reply');
			//写入message文档
			collection.insert(message, {safe : true}, function(err, message) {
				mongodb.close();
				callback(err, message);
			});
		});
	});
};


//根据消息id(数组)获得对应的回复数
Reply.getReplysByMids = function getReplysByMids(midsArr,callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('replys',function(err,collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.find( { "mid" : { $in : midsArr } }).toArray(function(err,data) {
				mongodb.close();
				// console.log('+++++++++++')
				// console.log(data)
				// console.log('+++++++++++')
				return callback(err,data)
			});
			// this.mid = mid || '';
			// this.rcontent = content;
			// this.uid = uid;
			// this.rtime = time || +new Date();

			// collection.find({mid:mid}).count(function(err,data) {
			// 	mongodb.close();
			// 	return callback(err,data);
			// })
			// collection.find({mid:mid}).toArray(function(err, data) {
			// 	if(err) {
			// 		mongodb.close();
			// 		return callback(err);
			// 	}
			// 	if(data instanceof Array) {
			// 		return callback(err,data.length);	
			// 	}
			// 	return callback(err,0);
			// })
		});
 	})
}


Reply.getReplyCountByMid = function getReplyCountByMid(mid,arrs) {
	var count = 0;
	for(var i=0; i<arrs.length; i++) {
		if(mid == arrs[i]['mid']) count++;
	}
	return count;
}