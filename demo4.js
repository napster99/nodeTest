var util = require('util');
var A = "a different value A";
var B = "a different value B";

var demo3 = require('./demo3');
util.log("A="+A+" B="+B+" values="+util.inspect(demo3.values()));