var events = require('events');
var util = require('util');

function Pulser() {
    events.EventEmitter.call(this);
}

util.inherits(Pulser,events.EventEmitter);

Pulser.prototype.start = function() {
    var self = this;
    this.id = setInterval(
        function() {
            util.log('>>>> pulse');
            self.emit('pulse','napster1','napster2');
            util.log('<<<< pulse');
        },1000
    );
}

var pulser = new Pulser();
pulser.on('pulse',function(data1,data2) {
    util.log('pulse received '+data1+'  '+data2 +'  '+arguments[0] +'  '+arguments[1]);
});
pulser.start();
