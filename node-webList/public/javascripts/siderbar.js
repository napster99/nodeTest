//@charset 'utf-8';

$(function() {
	var ui = {
		$btn : $('#signIn'),
		$signBtn : $('#againBtn')
	}
	var uid = $('#uid').val();
	var Page = {
		init : function() {
			this.view();
			this.addEventListener();
		},
		view : function() {

		},
		addEventListener : function() {
			var self = this;
			ui.$btn.on('click','',function() {
				$('#scratchCard').show();
			});
			ui.$signBtn.on('click','',function() {
				var point = (+$(this).attr('point')) + (+$('#score').text());
				self.sendAjax(uid,point);
			});
		},
		sendAjax : function(uid,score) {
			var self = this;
			var options = {
				'url' : '/updateScore',
				'dataType' : 'json',
				'type' : 'GET',
				'data' : {uid : uid, score : score},
				'success' : function(data) {
					$('#score').text(score);
					$('#scratchCard').hide();
					ui.$btn.text('已签到').attr('disabled','disabled');
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		}
 	}

 	Page.init();
});

