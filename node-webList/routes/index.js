
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('login', { title: 'Express',nap:'napster' });
// };

module.exports = function(app) {

	var crypto = require('crypto');
	var User = require('../models/user');
	var Post = require('../models/post');

	//登陆拦截器
	app.get('/*',function(req,res,next) {
		req.session.error = null;
		req.session.success = null;
		var url = req.originalUrl;

	    if (url != '/login' && url != '/' && url.indexOf('/topic/') < 0 && url.indexOf('?page=') < 0 && url !='/createTopic' && !req.session.user) {
	       console.log('login')
	        return res.redirect('/login');
	    }
	    
	    next();
	})


	app.get('/',function(req, res) {
		var curPage = 1;
		if(req.url.indexOf('?page=') > -1) 
			curPage = req.url.split('=')[1];


		try{
			Post.getPostsByCount(9,function(err, posts) {
				if(err) {
					req.session.error = err;
					return res.redirect('/');
				}
				
				res.render('index',{
					title : '首页',
					posts : posts
				});
				
			});
		}catch(e){
			console.log('Exception Coursor')
		}
		
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
			User.get(newPassword, function(err, user) {
				if(user) {
					req.session.error = 'passwordisexsit';
					return res.redirect('/modifyPwd');
				}
				if(err) {
					req.session.error = err;
					return res.redirect('/modifyPwd');
				}

				//如果不存在则更新该用户口令
				User.set(req.session.user,newPassword,function(err,result) {
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
		newUser.save(function(err) {
			if(err) {
				console.log(err)
				req.session.error = 'saveError';
				return res.redirect('/addUser');
			}
			
			// req.session.user = newUser;
			req.session.success = 'saveSuccess';
			req.session.error = null;
			
			res.redirect('/addUser');
		});

	});

	app.post('/login',function(req, res) {
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		User.get(password, function(err, user) {
			if(!user) {
				req.session.error = 'usernotexsit';
				return res.redirect('/login');
			}
			// if(user.password != password) {
			// 	req.session.error = 'pwderror';
			// 	return res.redirect('/login');
			// }
			console.log(user)
			req.session.user = user;
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
		user.getUsers(function(err,datas) {
			user.getAdmins(function(err,data) {
				res.render('webList', {
					title : '前端人员名单列表',
					users : datas,
					admin : data
				});
			})
		})
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
		return;
		User.get(req.params.user, function(err, user) {
			if(!user) {
				req.session.error = '用户名不存在';
				req.session.success = '';
				return res.redirect('/');
			}
			Post.get(user.name,function(err, posts) {
				if(err) {
					req.session.error = err;
					return res.redirect('/');
				}
				res.render('user', {
					title : user.name,
					posts : posts 
				});
			});
		});
	});

	//话题详细页
	app.get('/topic/:id',function(req,res) {
		res.render('messageDetail',{
			title : '对于链接只取前1k，谁能提供下代码或思路'
		});
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
		console.log(req.body['title'])
	})

};
