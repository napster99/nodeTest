$(function(){


	function showWhich($cur){
		
		$('ul[name=common]').find('li.active').removeClass('active');
		$cur.addClass('active');

	}

	switch(window.location.pathname){
		case '/':
			showWhich($('li[name=index]'));
			break;
		case '/login':
			showWhich($('li[name=login]'));
			break;
		case '/modifyPwd':
			showWhich($('li[name=modifyPwd]'));
			break;
		case '/addUser':
			showWhich($('li[name=addUser]'));
			break;
		case '/addDaily':
			showWhich($('li[name=addDaily]'));
			break;
		case '/webList':
			showWhich($('li[name=webList]'));
			break;
		default:
			$('ul[name=common]').find('li.active').removeClass('active');
	}
	
	$('.alert').fadeIn(1000,function(){
		var that = this;
		setTimeout(function(){
			$(that).fadeOut(1000);
		},2000);	
	});



});

Date.prototype.format =function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) 
		format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));

	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,
		RegExp.$1.length==1? o[k] :
		("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}


var CommonJS = {
	changeTime : function(time) {
		var curTime = +new Date();
		time = +new Date(time);
		
		if(curTime - time <= 60*60) {
			return '1小时前';
		}
		var hour = parseInt((curTime-time)/(1000*60*60));
		if(hour <= 24) {
			return hour == 0? '1小时前': hour+'小时前';
		}
		return new Date(time).format('yyyy-MM-dd');
	},
	logsType : {
		1 : '日报',
		2 : '周报',
		3 : '签到'
	}

}
