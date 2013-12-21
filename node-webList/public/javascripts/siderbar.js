//@charset 'utf-8';

$(function() {
	var ui = {
		$btn : $('#signIn'),
		$signBtn : $('#againBtn'),
		$signStatus : $('#signStatus')
	}
	var uid = $('#uid').val();
	var Page = {
		init : function() {
			this.view();
			this.addEventListener();
			this.initJsChart();
		},
		view : function() {
			var signStatus = ui.$signStatus.val();
			var curDate = (new Date()).format('yyyy-MM-dd');
			if(signStatus == curDate) {
				ui.$btn.text('已签到').attr('disabled','disabled');
			}
		},
		addEventListener : function() {
			var self = this;
			$('#scratchCard')[0].seleted = false;
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
					console.log(data);
					$('#score').text(score);
					$('#scratchCard').hide();
					ui.$btn.text('已签到').attr('disabled','disabled');
					self.changeSignStatus();
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		},
		//改变签到状态
		changeSignStatus : function() {
			var options = {
				'url' : '/changeSignStatus',
				'dataType' : 'json',
				'type' : 'POST',
				'success' : function(data) {
					console.log(data)
				},
				'error' : function(err) {
					console.log(err)
				}
			}
			$.ajax(options);
		},

		initJsChart : function() {
			var options = {
				'url' : '/getRanking',
				'dataType' : 'json',
				'type' : 'GET',
				'success' : function(data) {
					var usersArr = [];
					for(var i=0; i<3; i++) {
						usersArr.push([data[i]['name'] || '--' ,data[i]['score']]);
					}

					var myData = new Array(usersArr[0], usersArr[1], usersArr[2]);
					var colors = ['#FACC00', '#FB9900', '#FB6600'];
					var myChart = new JSChart('graph', 'pie');
					myChart.setDataArray(myData);
					myChart.colorizePie(colors);
					myChart.setTitle('前端社区积分前三排行榜');
					myChart.setTitleColor('#857D7D');
					myChart.setPieUnitsColor('#9B9B9B');
					myChart.setPieValuesColor('#6A0000');
					myChart.setSize(270, 300);
					myChart.draw();
					
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

