//@charset 'utf-8';

// var $ui = $('.breadcrumb').find('li.active');

// if(window.location.hash == '#day') {
// 	$ui.text('日报详情');
// }else if(window.location.hash == '#week') {
// 	$ui.text('周报详情');
// }

$(function() {
	var ui = {
		$editBtn : $('#editBtn'),
		$saveBtn : $('#saveBtn'),
		$cancelBtn : $('#cancelBtn'),
		$showArea : $('#showArea'),
		$editArea : $('#editArea'),
		$theContent : $('#theContent')
	}
	var uid = $('#uid').val();
	var editor = null;

	var Page = {
		init : function() {
			this.view();
			this.addEventListener();
		},
		view : function() {


			KindEditor.ready(function(K) {
				editor = K.create('textarea[name="content"]', {
					allowFileManager : true
				});
			});

			
		},
		addEventListener : function() {
			var self = this;
			ui.$editBtn.on('click','',function() {
				ui.$showArea.hide();
				ui.$editArea.show();
				var html = ui.$theContent.val();
				console.log(editor)
				editor.html('HTML内容');
			});

			ui.$saveBtn.on('click','',function() {
				self.sendSaveAjax();
			});

			ui.$cancelBtn.on('click','',function() {
				ui.$showArea.show();
				ui.$editArea.hide();
			});
		},
		sendSaveAjax : function() {
			
		}
 	}

 	Page.init();
});




