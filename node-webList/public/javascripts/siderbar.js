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
					var usersArr = [], colorsArr = [];
					for(var i=0; i<data.length; i++) {
						usersArr.push([data[i]['name'],data[i]['score']]);
						colorsArr.push('#66FF99');
					}
					var myChart = new JSChart('graph', 'bar', '');
					myChart.setDataArray(usersArr);
					myChart.colorize(colorsArr);
					myChart.setSize(270, 300);
					myChart.setBarValues(false);
					myChart.setBarSpacingRatio(45);
					myChart.setBarOpacity(0.8);
					myChart.setBarBorderWidth(0);
					myChart.setTitle('前端社区积分排行榜');
					myChart.setTitleFontSize(12);
					myChart.setTitleColor('#08c');
					myChart.setAxisValuesColor('#666');
					myChart.setAxisNameX('');
					myChart.setAxisNameY('');
					myChart.setAxisColor('#08c');
					myChart.setAxisNameColor('#666');
					myChart.setGridOpacity(0.8);
					myChart.setGridColor('#D3B5B4');
					myChart.setIntervalEndY(50);
					myChart.setAxisReversed(true);
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

