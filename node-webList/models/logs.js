var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectID = mongoose.Schema.Types.ObjectId;


var logScoreSchema = new Schema({
  name:  String,
  uid: String,
  role:   String,
  time : {type:Date,default:Date.now},
  score : {type:Number,default : 0},
  type : {type:Number,default : 1}    //1:日报  2:周报  3:签到    ...
});

//存储积分日志
logScoreSchema.static('saveLogScore',function(logScore,callback) {
	logScore.save(function(err,logScore) {
		callback(err,logScore);
	})
});



var logScore = mongoose.model('Logs.score', logScoreSchema);

module.exports = logScore;