//@charset 'utf-8';

var $ui = $('.breadcrumb').find('li.active');

if(window.location.hash == '#day') {
	$ui.text('日报详情');
}else if(window.location.hash == '#week') {
	$ui.text('周报详情');
}


