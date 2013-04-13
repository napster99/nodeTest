/**
 * String vs Buffer
 * @author morrisonleisure@163.com Napster
 */
x = 5;

setTimeout(function() {
	++x;
	debugger;
	function a() {
		x *= 3;
		debugger;
	}
	a();
	console.log('done');
},1000);
debugger;
console.log('begin');