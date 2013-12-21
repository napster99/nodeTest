var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectID = mongoose.Schema.Types.ObjectId;

var LogScore = require('./logs');


var userSchema = new Schema({
  name:  String,
  password: String,
  role:   String,
  mobile : String,
  uid    : String,
  score : {type:Number,default : 0},
  flag : {
  	sign : {type:String,default:''},
  	day : {type:String,default:''}
  }
});

userSchema.static('saveUser',function(user,callback) {
	user.save(function(err,user) {
		callback(err,user);
	})
})

//根据所有用户
userSchema.static('getUsers',function(callback) {
	return this.find(function(err,users) {
		callback(err,users);
	})
})


//根据管理员
userSchema.static('getAdmins',function(callback) {
	return this.find({'role':'2'},function(err,users) {
		callback(err,users);
	})
});

//根据密码获取用户
userSchema.static('getUserByPwd',function(password,callback) {
	return this.findOne({password : password},function(err,user) {
		callback(err,user);
	})
});

//根据更新用户密码
userSchema.static('setUserPwd',function(user,newPassword,callback) {
	return this.findOneAndUpdate({'_id' : user._id}, { password: newPassword },  function(err,user) {
		callback(err,user);
	})
});

//通过uids（数组）获取用户信息
userSchema.static('getUsersByUids',function(uids,callback) {
	
	// name:  String,
  // uid: String,
  // role:   String,
  // time : {type:Date,default:Date.now},
  // score : {type:Number,default : 0},
  // type : {type:Number,default : 1}    //1:日报  2:周报  3:签到    ...


	var logScore = new LogScore({

	});
	// console.log('===================')
	// console.log(LogScore)
	// console.log('===================')

	LogScore.saveLogScore();

	return this.find({ "_id" : { $in : uids } },function(err,users) {
		callback(err,users);
	})
});


//通过uid得到uname
userSchema.static('getUsernameByUid',function(uid,users) {
	for(var i=0; i<users.length; i++) {
		if(uid == users[i]['_id']) return users[i]['name'];
	}
	return '';
})


//通过uid获取User对象
userSchema.static('getUserByUid', function(uid,callback) {

	return this.findOne({ "_id" :  uid },function(err,user) {
		callback(err,user);
	})
});


//更新积分
userSchema.static('updateScore',function(uid,score,callback) {



	return this.findOneAndUpdate({ "_id" : uid }, { score: score },  function(err,user) {
			callback(err,user);
		})
});


//通过uid获取更新签到
userSchema.static('changeSignStatus', function(uid,callback) {
	var nowDate = new Date();
	var sign = nowDate.format('yyyy-MM-dd');
	return this.findOneAndUpdate({ "_id" : uid }, { 'flag.sign': sign },  function(err,user) {
			callback(err,user);
		})
});

//积分排行榜
userSchema.static('getRanking',function(callback) {
	return this.find().sort({'score':-1}).exec(callback);;
});


var User = mongoose.model('User', userSchema);

module.exports = User;