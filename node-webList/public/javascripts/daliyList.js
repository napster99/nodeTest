//@charset 'utf-8';
/*
 * 日报周报列表页
 */

$(function() {
	var ui = {
		$dayContainer : $('#day_list'),
		$weekContainer : $('#week_list'),
		$dayPagi : $('#dayPagi'),
		$weekPagi : $('#weekPagi')
	}

	var uid = $('#uid').val() || '52973838efeab35c11000002';
	
	var Page = {

		init : function(){
			var self = this;
			this.getDailyAjax(1,'day');
			
			setTimeout(function() {
				self.getDailyAjax(1,'week');
			},100);
		},
		view : function() {

		},
		addEventListener : function() {

		},

		getDailyAjax : function(curPage,type) {
			var self = this;
			var options = {
				'url' : '/getDailyAjax',
				'dataType' : 'json',
				'type' : 'GET',
				'data' : {curPage : curPage ||1, uid : uid, type : type},
				'success' : function(data) {
					if(data['type'] == 'day') {
						self.renderPagi(data['day']['page'],data['day']['totalPages'],'day');
						self.renderList(data['day']['data'],'day');
					}else{
						console.log(data['week']['data'])
						self.renderPagi(data['week']['page'],data['week']['totalPages'],'week');
						self.renderList(data['week']['data'],'week');
					}
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		},
		// getWeekAjax : function(curPage) {
		// 	var self = this;
		// 	var options = {
		// 		'url' : '/getWeekAjax',
		// 		'dataType' : 'json',
		// 		'type' : 'GET',
		// 		'data' : {curPage : curPage || 1 , uid : uid},
		// 		'success' : function(data) {
		// 			self.renderPagi(data['page'],data['totalPages'],'week');
		// 			self.renderList(data['data'],'week');
		// 		},
		// 		'error' : function(err) {
		// 			console.log(err)
		// 		}
		// 	}
		// 	$.ajax(options);
		// },
		renderPagi : function(page,totalPages,which) {
			var self = this;
			 var options = { 
                   currentPage: page || 1, 
                    totalPages: totalPages, 
                 numberOfPages:5, 
                onPageClicked : function(event,originalEvent,type,page) { 
                    var tid = $(this)[0].id;
                    if(tid == 'dayPagi') {
                    	self.getDailyAjax(page,'day');
                    } else if(tid == 'weekPagi') {
                    	self.getDailyAjax(page,'week');
                    }
                  } 
              } 
              if(which == 'day') {
              	ui.$dayPagi.bootstrapPaginator(options); 
              } else if(which == 'week') {
              	ui.$weekPagi.bootstrapPaginator(options); 
              }
		},
		renderList : function(data,type) {
			var html = '';
			for(var i=0,len=data.length; i<len; i++) {
				html += '<div class="cell">'
				+'<div class="user_avatar block">'
				+'	<a target="_blank" href="#" title="xx">'
				+'		<img src="http://gravatar.qiniudn.com/avatar/1fe5c803a92e0a808a42d0117167275f?size=48">'
				+'	</a>'
				+'</div>'
				+'<div class="topic_wrap">'
				+'	<a href="/dailyDetail/'+data[i]['_id']+'#'+type+'" target="_blank" style="margin-left:10px;">'
				+data[i]['mtitle']
				+'</a>'
				+'</div>'
				+'<div class="last_time">'+data[i]['mtime']+'</div>'
				+'</div>'
			}
			if(type == 'day') {
				ui.$dayContainer.html(html);
			}else if(type == 'week'){
				ui.$weekContainer.html(html);
			}
			
		}
	}

	Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             