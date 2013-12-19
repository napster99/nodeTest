
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('login', { title: 'Express',nap:'napster' });
// };

module.exports = function(app) {

	var crypto = require('crypto');
	var User = require('../models/user');
	var Message = require('../models/message');
	var Reply = require('../models/replys');
	var CommonJS = require('../models/common');
	var querystring = require('querystring');
	var url = require('url');

	//登陆拦截器
	app.get('/*',function(req,res,next) {
		req.session.error = null;
		req.session.success = null;
		var url = req.originalUrl;

	    if (url != '/addUser' && url != '/login' && url != '/' && url.indexOf('/topic/') < 0 && url.indexOf('?page=') < 0 && url !='/createTopic' && !req.session.user) {
	        return res.redirect('/login');
	    }
	    next();
	})

	//访问首页
	app.get('/',function(req, res) {
		var curPage = 1,perPages = 10;
		if(req.url.indexOf('?page=') > -1) 
			curPage = req.url.split('=')[1];
		//根据curPage 获得message数组
		Message.getMessagesByPage(curPage,perPages,function(err, data) {
			//根据每页显示数量，message数组长度，计算出总页数
			var totalPages = 1;
			/* 
			 * 输出给页面的元素
			 *  回复数        点击数       标题      发表时间  消息ID    用户ID
			 *  replyCount    clickCount   title     time       mid      uid
			 */
			var objArr = [];
			if(data instanceof Array) {
				Message.getMessagesCountByType('normal',function(err,count) {
					if(count % perPages == 0 ) {
						totalPages = parseInt(count/perPages);
					}else{
						totalPages = parseInt(count/perPages) + 1;
					}
					var midsArr = [],uidsArr = [];
					for(var i=0; i<data.length; i++) {
						midsArr.push(data[i]['_id']);
						uidsArr.push(data[i]['uid']);
					}
					Reply.getReplysByMids(midsArr,function(err,replyArr) {
						if(err) {
							//TODO 查询回复数出错
						}else{

							User.getUsersByUids(uidsArr,function(err,userArr) {
								for(var i=0; i<data.length; i++) {
									//根据message数组不同元素，获得元素对应的回复数
									var mtime = data[i]['mtime']
									var time = CommonJS.changeTime(mtime);
									
									var obj = {
										'replyCount' : Reply.getReplyCountByMid(data[i]['_id'],replyArr),
										'clickCount' : data[i]['clickCount'] || 0,
										'title'      : data[i]['mtitle'],
										'time'       : time,
										'mid'        : data[i]['_id'],
										'uid'        : data[i]['uid'],
										'uname' 	 : User.getUsernameByUid(data[i]['uid'],userArr),
										'totalPages' : totalPages
									}
									objArr.push(obj);
								}

								if(req.session.user) {
									//获取积分数
									User.getUserByUid(req.session.user._id,function(err,user) {
										//组装成对象，输出到页面
										res.render('index',{
											title : '首页',
											objArr : objArr,
											user : req.session.user,
											score : user['score']
										});
									})
									
								}else{
									//组装成对象，输出到页面
									res.render('index',{
										title : '首页',
										objArr : objArr,
										user : req.session.user
									});
								}
							})
						}
					});
				})
			}
		});
	});

	app.get('/modifyPwd', function(req, res) {
		req.session.error = null;
		res.render('modifyPwd',{
			title : '修改口令'
		});
	});

	app.post('/modifyPwd',function(req, res) {
		var password = req.body['password'];
		var oldpassword = req.body['oldpassword'];

		//检测密码长度为6~20位之间
		if(password.length < 6 || password.length > 20) {
			req.session.error = 'pwdformaterror';
			return res.redirect('/modifyPwd');
		}

		//生成口令的散列值
		var newPassword = crypto.createHash('md5').update(password).digest('base64');
		var oldPassword = crypto.createHash('md5').update(oldpassword).digest('base64');
		
		//检测是否匹配原密码
		if(req.session.user.password != oldPassword) {
			req.session.error = 'oldpassworderror';
			return res.redirect('/modifyPwd');
		}
		
		if(newPassword != req.session.user.password) {
			//检查口令是否已经存在
			User.getUserByPwd(newPassword, function(err, user) {
				if(user) {
					req.session.error = 'passwordisexsit';
					return res.redirect('/modifyPwd');
				}
				if(err) {
					req.session.error = err;
					return res.redirect('/modifyPwd');
				}

				//如果不存在则更新该用户口令
				User.setUserPwd(req.session.user,newPassword,function(err,result) {
					req.session.success = 'success';
					return res.redirect('/login');
				})
			});
		}else{
			req.session.success = 'success';
			return res.redirect('/login');
		}
	}); 


	app.get('/login' , function(req, res) {
		res.render('login', {
			title : '用户登入'
		});
	});	

	//新成员录入
	app.get('/addUser' , function(req, res) {
		res.render('addUser', {
			title : '新成员录入'
		});
	});	

	app.post('/addUser',function(req,res) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password || '123456').digest('base64');

		var name = req.body.name;
		var mobile = req.body.mobile;
		var authority = req.body.authority;

		if(name.replace(/\s*/g,'') === '') {
			req.session.error = 'namenotnull';
			return res.redirect('/addUser');
		}
		if(mobile.replace(/\s*/g,'') === '') {
			req.session.error = 'mobilenotnull';
			return res.redirect('/addUser');
		}
		if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))){ 
			req.session.error = 'mobileformaterror';
			return res.redirect('/addUser');
		}

		var newUser = new User({
			 name : name,
			 password : password,
			 role : authority,
			 mobile : mobile
		});

		//将新成员录入数据库
		User.saveUser(newUser,function(err,user) {
			if(err) {
				req.session.error = 'saveError';
				return res.redirect('/addUser');
			}
			// req.session.user = newUser;
			req.session.success = 'saveSuccess';
			req.session.error = null;
			
			res.redirect('/login');
		}) 
		// newUser.save(function(err) {
		// 	if(err) {
		// 		req.session.error = 'saveError';
		// 		return res.redirect('/addUser');
		// 	}
			
		// 	// req.session.user = newUser;
		// 	req.session.success = 'saveSuccess';
		// 	req.session.error = null;
			
		// 	res.redirect('/login');
		// });

	});

	app.post('/login',function(req, res) {
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		User.getUserByPwd(password, function(err, user) {
			if(!user) {
				req.session.error = 'usernotexsit';
				return res.redirect('/login');
			}
			if(user.password != password) {
				req.session.error = 'pwderror';
				return res.redirect('/login');
			}
			req.session.user = user;
			console.log('+++++++++++登入成功++++++++++++++');
			console.log(req.session.user);
			console.log('+++++++++++登入成功++++++++++++++');
			req.session.success = '登入成功';
			req.session.error = null;
			res.redirect('/');
		});
	});

	app.get('/logout', function(req, res) {
		req.session.user =  null;
		req.session.success = '登出成功';
		res.redirect('/');
	});

	app.get('/webList' , function(req, res) {
		var user = new User(req.session.user);
		User.getUsers(function(err,datas) {
			Message.getUnPassMessages(function(err,messages) {
				var uids = [];
				for(var i=0; i<messages.length; i++) {
					uids.push(messages[i]['uid']);
				}
				User.getUsersByUids(uids,function(err,users) {
					for(var i=0; i<messages.length; i++) {
						messages[i]['type'] = User.getUsernameByUid(messages[i]['uid'],users);
						messages[i]['mtime'] = CommonJS.changeTime(messages[i]['mtime']);
					}
					res.render('webList', {
						title : '管理人员',
						users : datas,
						messages : messages
					});

				});
			})
		})
	});	

	app.get('/getDailyDetailForPass',function(req,res) {
		var pquery = querystring.parse(url.parse(req.url).query);   
		var mid = pquery['mid'];

		Message.getMessageByMid(mid,function(err,message) {
			if(!err) {
				var uid = message['uid'];
				User.getUsersByUids([uid],function(err,user) {
					var data = {
						'uname' : user[0]['name'],
						'message' : message
					}
					res.send(data);
				})
			}
		});
	});

	// app.post('/post',function(req, res) {
	// 	var currentUser = req.session.user;
	// 	var post = new Post(currentUser.name, req.body.post);
	// 	post.save(function(err) {
	// 		if(err) {
	// 			req.session.error = err;
	// 			return res.redirect('/');
	// 		}
	// 		req.session.success = '发表成功';
	// 		res.redirect('/u/'+currentUser.name);
	// 	});
	// });

	//个人主页
	app.get('/user/:user', function(req, res) {
		res.render('user',{
			title : 'xx'
		})
		
	});

	//话题详细页
	app.get('/topic/:id',function(req,res) {
		var mid = req.params.id;
		var messageDetail = {};
		console.time('nap')

		Message.getMessageByMid(mid,function(err,data) {
			if(err) {
				//TODO
			} else {
				/*
				 * 信息详细页展示  
				 * 消息标题     消息内容       发布者姓名和uid 发布时间   回复数      回复实体
				 * mtitle        mcontent       mname muid      mtime     replyCount   mReplyObj
				 * 	
				 * 	mReplyObj-->rcontent mid uid  uname rtime 
 				 */
 				User.getUsersByUids([data['uid']],function(err,user) {
 					messageDetail['mtitle'] = data['mtitle'];
 					messageDetail['mcontent'] = data['mcontent'];
 					messageDetail['mname'] = user[0]['name'];
 					messageDetail['muid'] = user[0]['_id'];
 					messageDetail['mtime'] = CommonJS.changeTime(data['mtime']);
 					messageDetail['mid'] = data['_id'];
 					Reply.getReplysByMids([mid],function(err,replyArr) {
						if(err) {
							//TODO
						}else{
							var uidArr = [];
							for(var i=0; i<replyArr.length; i++) {
								uidArr.push(replyArr[i]['uid']);
							}
							User.getUsersByUids(uidArr,function(err,users) {
								var tempArr = [];
								for(var i=0; i<replyArr.length; i++) {
									var objReply = {
										'rcontent' : replyArr[i]['rcontent'],
										'mid' : replyArr[i]['mid'],
										'uid' : replyArr[i]['uid'],
										'uname' : User.getUsernameByUid(replyArr[i]['uid'],users),
										'rtime' : CommonJS.changeTime(replyArr[i]['rtime']) 
									}
									tempArr.push(objReply);
								}
								messageDetail['mReplyObj'] = tempArr;
								Message.updateMessagecNumByMid(mid,function(err) {
										if(err) {
											//TODO
										}else{
											res.render('messageDetail',{
													'title':messageDetail['mtitle'],
													'messageDetail' : messageDetail
												})
										}
									});
							})
							
						}
					})
 				});
			}
		})
		console.timeEnd('nap')

		// res.render('messageDetail',{
		// 	title : '对于链接只取前1k，谁能提供下代码或思路'
		// });
		//return res.redirect('/topic/'+req.params.id);
	});


	//发表话题
	app.get('/createTopic',function(req,res) {
		res.render('create',{
			title : '发表话题'
		});
		//return res.redirect('/topic/'+req.params.id);
	});

	//提交话题
	app.post('/topic/create',function(req,res) {
		var title = req.body['title'];
		var content = req.body['content'];
		var message = new Message({
			'mtitle' : title,
			'mcontent' : content,
			'uid' : req.session.user._id,
			'type' : 'normal'
		});

		Message.saveMessage(message,function(err,data) {
			if(err) {
				req.session.error = err;
				return res.redirect('/topic/create');
			}
			if(data) {
				return res.redirect('/');
			}
		})
		
	})

	//提交回复
	app.post('/reply/:mid',function(req,res) {
		var content = req.body['content'];
		var mid = req.params.mid;
		var uid = req.session.user._id;
		console.log('uid'+uid)
		var reply = new Reply({
			'mid' : mid,
			'rcontent' : content,
			'uid' : uid
		});

		Reply.saveReply(reply,function(err,reply) {
			if(err) {
				//TODO
			} else {
				return res.redirect('/topic/'+mid);
			}
		})

	})



	//写日报
	app.get('/addDaily',function(req, res) {
		res.render('addDaily',{
			title : '发布日报',
			user : req.session.user
		});
	});

	//提交日报
	app.post('/createDaily',function(req,res) {
		var title = req.body['title'];
		var content = req.body['content'];
		
		var message = new Message({
			'mtitle' : title,
			'mcontent' : content,
			'uid' : req.session.user._id,
			'type' : 'day',
			'pass' : 'waiting'
		});

		Message.saveMessage(message,function(err,data) {
			if(err) {
				req.session.error = err;
				return res.redirect('/addDaily');
			}
			if(data) {
				return res.redirect('/dailyList/'+req.session.user['_id']);
			}
		})
	})

	//日报列表
	app.get('/dailyList/:uid',function(req,res) {
		var uid = req.params.uid;
		User.getUsersByUids([uid],function(err,data) {
			if(!err) {
				res.render('dailyList',{
					title : '日报列表',
					uid : uid,
					user : data[0]
				});
			}
		})
		
	});

	//ajax获取分页列表
	app.get('/getDailyAjax',function(req,res) {
		var pquery = querystring.parse(url.parse(req.url).query);   
		var perPages = 5;
		var type = pquery['type'] || 'day';
		var uid = pquery['uid'] || req.session.user._id;
		// getMessagesByMore(page,perCount,uid,type,callback)
		Message.getMessagesCountByMore('day',uid,function(err,dayCount) {
			Message.getMessagesByMore(pquery['curPage'],perPages,pquery['uid'],'day',function(err,dayArr) {
				var dtotalPages = 1;
				if(dayCount % perPages == 0 ) {
					dtotalPages = parseInt(dayCount/perPages);
				}else{
					dtotalPages = parseInt(dayCount/perPages) + 1;
				}
				
				for(var i=0,len=dayArr.length; i<len; i++) {
					dayArr[i]['mtime'] = CommonJS.changeTime(dayArr[i]['mtime']);
				}
				var data = {
					'type' : type,
					'day' : {
						'page' : pquery['curPage'],
						'totalPages' : dtotalPages,
						'data' : dayArr,
					}
				}
				res.send(data);
			})
		})
	})

	
	//日报详细页
	app.get('/dailyDetail/:id',function(req,res) {
		var mid = req.params.id;
		var messageDetail = {};
		console.time('nap')

		Message.getMessageByMid(mid,function(err,data) {
			if(err) {
				//TODO
			} else {
				/*
				 * 信息详细页展示  
				 * 消息标题     消息内容       发布者姓名和uid 发布时间   回复数      回复实体
				 * mtitle        mcontent       mname muid      mtime     replyCount   mReplyObj
				 * 	
				 * 	mReplyObj-->rcontent mid uid  uname rtime 
 				 */
 				User.getUsersByUids([data['uid']],function(err,user) {
 					// console.log(user)
 					messageDetail['mtitle'] = data['mtitle'];
 					messageDetail['mcontent'] = data['mcontent'];
 					messageDetail['isPass'] = data['pass'];
 					messageDetail['mname'] = user[0]['name'];
 					messageDetail['muid'] = user[0]['_id'];
 					messageDetail['mtime'] = CommonJS.changeTime(data['mtime']);
 					messageDetail['mid'] = data['_id'];

 					Reply.getReplysByMids([mid],function(err,replyArr) {
						if(err) {
							//TODO
						}else{
							if(replyArr.length > 0 && replyArr[0]['type'] === 'admin') {
								messageDetail['rcontent'] = replyArr[0]['rcontent'];
								messageDetail['rtime'] = replyArr[0]['rtime'];

								res.render('dailyDetail',{
									'title':messageDetail['mtitle'],
									'messageDetail' : messageDetail
								})
							} else {
								res.render('dailyDetail',{
									'title':messageDetail['mtitle'],
									'messageDetail' : messageDetail
								})
							}
							
							
						}
					})
 				});
			}
		})
		console.timeEnd('nap')
	});

	//更新积分
	app.get('/updateScore',function(req,res) {
		var pquery = querystring.parse(url.parse(req.url).query);   
		var uid = pquery['uid'];
		var score = pquery['score'];

		User.getUserByUid(uid,function(err,user) {
			if(!err) {
				score = (+user['score']) + (+score);
				User.updateScore(uid,score,function(err,rows) {
					if(rows) {
						res.send({'message':'success'});
					}
				})
			}
		})
	})

	//改变签到状态
	app.post('/changeSignStatus',function(req,res) {
		User.changeSignStatus(req.session.user._id,function(err,user) {
			if(!err && user) {
				req.session.user = user;
				res.send();
			}
		})
	})

	//管理员通过审核 【Admin】
	app.post('/changeMessageStatus',function(req,res) {
		var mid = req.body['mid'];
		var uid = req.body['uid'];
		var status = req.body['status'];
		var reviews = req.body['reviews'];
		var score = req.body['score'];

		Message.changeMessageStatus(mid,status,function(err,message) {
				//如果管理员有点评
				if(reviews != '') {
					var reply = new Reply({
						'mid' : mid,
						'rcontent' : reviews,
						'uid' : uid,
						'type' : 'admin'
					});
					Reply.saveReply(reply,function(err,reply) {
						if(status === 'passed') {
							//给成员加积分
							User.getUserByUid(uid,function(err,user) {
								if(!err) {
									score = (+user['score']) + (+score);
									User.updateScore(uid,score,function(err,rows) {
										if(!err) {
											res.send({'message':'success'});
										}
									})
								}
							})
						} else {
							//不通过
							res.send({'message':'success'});
						}

					})
				}
		})
	})



};
