//@charset 'utf-8';

$(function() {
  var ui = {
    $btn : $('#signIn'),
    $signBtn : $('#againBtn'),
    $signStatus : $('#signStatus'),
    $rankContainer : $('#rankContainer')
  }
  var uid = $('#uid').val();
  var Page = {
    pageData : {
      user : {},
      userSort : {}
    },
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
          $('#score').text(score);
          $('#scratchCard').hide();
          ui.$btn.text('已签到').attr('disabled','disabled');
          self.changeSignStatus();
        },
        'error' : function(err) {
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
        },
        'error' : function(err) {
        }
      }
      $.ajax(options);
    },

    initJsChart : function() {
      var self = this;
      var options = {
        'url' : '/getRanking',
        'dataType' : 'json',
        'type' : 'GET',
        'success' : function(data) {
          self.renderRanking(data);
        },
        'error' : function(err) {
        }
      }
      $.ajax(options);
    },

    renderRanking　 : function (data) {
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        if(data[i]['role'] == '2') {
          // i--;
        }else{
          Page.pageData.user[data[i]['_id']] = data[i];
          Page.pageData.user[data[i]['_id']]['sort'] = i+1;
          Page.pageData.userSort[i+1] = data[i];  
        }
      }

      for(var i=0; i<data.length; i++) {
        if(data[i]['role'] != '2') {

          if(i === 0) {
            htmlStr += '<tr>'
                +'    <td><label class="label label-success">'+(i+1)+'</label></td><td>'+data[i]['name']+'</td><td>'+data[i]['score']+'</td>' 
                +'</tr>';
          } else if(i === 1) {
            htmlStr += '<tr>'
                +'    <td><label class="label label-warning">'+(i+1)+'</label></td><td>'+data[i]['name']+'</td><td>'+data[i]['score']+'</td>' 
                +'</tr>';
          } else if(i === 2) {
            htmlStr += '<tr>'
                +'    <td><label class="label label-info">'+(i+1)+'</label></td><td>'+data[i]['name']+'</td><td>'+data[i]['score']+'</td>' 
                +'</tr>';
          }
        }
      }

      var curUser = Page.pageData.user[uid];
      if(curUser) {
        if(curUser['sort']==4) {
          htmlStr += '<tr>'
                +'    <td>4</td><td>'+curUser['name']+'</td><td>'+curUser['score']+'</td>' 
                +'</tr>';
        }else if(curUser['sort'] > 4){
          htmlStr += '<tr>'
                +'    <td>...</td><td></td><td></td>' 
                +'</tr>';
          htmlStr += '<tr>'
                +'    <td>'+curUser['sort']+'</td><td>'+curUser['name']+'</td><td>'+curUser['score']+'</td>' 
                +'</tr>';
        }

        if(curUser['sort'] != ( data.length - 1) ) {
          htmlStr += '<tr>'
                +'    <td>...</td><td></td><td></td>' 
                +'</tr>';
        }

      }

      ui.$rankContainer.html(htmlStr);
    }


  }

  Page.init();
});

