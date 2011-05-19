var assert = require('assert');
var fork = require('../lib/hydracp').fork;

var childScript = __dirname + '/fixtures/child-process-echo.js';
var n = fork(childScript, [4,2,0]);

var messageCount = 0;

n.on('message', function (m) {
  assert.ok(m.foo);
  assert.deepEqual(message, m);
  messageCount++;
  process.exit();
});

var message = {foo: []};

for (var i = 0; i < 10000; i++) {
  message.foo.push({ hello: 'world', b: { a: '1' } });
}

n.send(message);
