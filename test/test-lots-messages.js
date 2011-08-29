var assert = require('assert');
var fork = require('../lib/hydracp').fork;

var childScript = __dirname + '/fixtures/child-process-echo.js';
var n = fork(childScript, [4,2,0]);

var messageCount = 0;
var numMsgs = 1000;

n.on('message', function (m) {
  ++messageCount;
  if (messageCount == numMsgs) {
    process.exit();
  }
});

var i = numMsgs;

var arr = new Array(500).join('world');

while (i--) {
  var message = {};
  message["hello"+i] = arr;
  n.send(message);
}
