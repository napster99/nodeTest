//@charset 'utf-8';
/*
 * 管理员审核日报页
 */

$(function() {
	var ui = {
		$startPassBtn : $('button[name=startPassBtn]'),
		$passBtn : $('#passBtn'),
		$unPassBtn : $('#unPassBtn'),
		$backBtn : $('#backBtn'),
		$msgCon : $('#msgCon'),
		$msgList : $('#msgList'),
		$msgDetail : $('#msgDetail'),
		$reviews : $('#reviews'),
		$score : $('#score')
	}

	var Page = {
		init : function(){
			var self = this;
			this.view();
			this.addEventListener();
		},
		view : function() {

		},
		addEventListener : function() {
			var self = this;
			ui.$startPassBtn.on('click','',function() {
				var mid = $(this).attr('mid');
				self.getDailyDetail(mid);
			});
			//通过
			ui.$passBtn.on('click','',function() {
				var mid = ui.$msgDetail.attr('mid');
				var uid = ui.$msgDetail.attr('uid');
				var reviews = ui.$reviews.val().replace(/\s*/g,'');
				var score = ui.$score.val();
				if(!/^[0-9]*[1-9][0-9]*$/.test(score)) {
					alert('请输入正整数的积分！');
					ui.$score.val('').focus();
					return;
				}
				self.changeMessageStatus(mid,'passed',uid,reviews,score);
			});
			//不通过
			ui.$unPassBtn.on('click','',function() {
				var mid = ui.$msgDetail.attr('mid');
				var uid = ui.$msgDetail.attr('uid');
				var reviews = ui.$reviews.val().replace(/\s*/g,'');
				var score = ui.$score.val();
				self.changeMessageStatus(mid,'unpass',uid,reviews,score);
			});
			//返回列表
			ui.$backBtn.on('click','',function() {
				ui.$msgDetail.hide();
				ui.$msgList.show();
			})
		},

		changeMessageStatus : function(mid,status,uid,reviews,score) {
			var options = {
				'url' : '/changeMessageStatus',
				'dataType' : 'json',
				'type' : 'POST',
				'data' : {mid : mid,status : status ,uid : uid,reviews:reviews,score:score},
				'success' : function(data) {
					console.log(data)
					if(data['message'] == 'success') {
						window.location.href = window.location.href;
					}
				},
				'error' : function(err) {
					
				}
			}
			$.ajax(options);
		},

		getDailyDetail : function(mid) {
			var self = this;
			var options = {
				'url' : '/getDailyDetailForPass',
				'dataType' : 'json',
				'type' : 'GET',
				'data' : {mid : mid },
				'success' : function(data) {
					self.renderList(data);
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		},
		renderList : function(data) {
			var html = '',uname = data['uname'],message = data['message'];
			html += '<h3>'+message['mtitle']+'</h3>'
			+'<hr>'
			+'<div class="topic_content"> '
			+'    <div class="well"> '+message['mcontent'] + '</div>'
			+'</div>'
			+'<hr>'
			+'<div class="changes"> '
			+'     <span class="col_fade"> '
			+'          <a class="dark" href="javascript:;">'+uname+'</a> 在 '+message['mtime']+' 发布 '
			+'     </span>'
			+'</div>';
			ui.$msgCon.html(html);
			ui.$msgDetail.attr('mid',message['_id']).attr('uid',message['uid']);
			ui.$msgList.hide();
			ui.$msgDetail.show();
		}
	}

	Page.init();

});


                
                  
                
                
                    
                        
                    
                
                
             