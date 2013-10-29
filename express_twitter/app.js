var app = require('express').createServer(),
twitter = require('ntwitter');

app.listen(3000);

var twit = new twitter({
	consumer_key: '',
	consumer_secret : '',
	access_token_key: '',
	access_token_secret : ''
});

twit.stream('statuses/filter',{track:['love','hate']},function(stream) {
	stream.on('data' ,function(data) {
		console.log(data);
	})
})