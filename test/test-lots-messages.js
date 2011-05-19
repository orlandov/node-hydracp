var assert = require('assert');
var fork = require('../lib/hydracp').fork;

var childScript = __dirname + '/fixtures/child-process-echo.js';
var n = fork(childScript, [4,2,0]);

var messageCount = 0;
var numMsgs = 100;

n.on('message', function (m) {
  assert.deepEqual(message, m);
  ++messageCount;
  if (messageCount == numMsgs) {
    process.exit();
  }
});

var message = { hello: 'world' };

var i = numMsgs;

while (i--) {
  n.send(message);
}
