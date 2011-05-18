var assert = require('assert');
var fork = require('../lib/hydracp').fork;

var childScript = __dirname + '/fixtures/child-process-fork-node.js';
var n = fork(childScript, [4,2,0]);

var messageCount = 0;

n.on('message', function (m) {
  console.log('PARENT got message:', m);
  assert.ok(m.foo);
  messageCount++;
});

n.send({ hello: 'world', argv: [process.execPath, childScript, 4, 2, 0] });

var childExitCode = -1;
n.on('exit', function(c) {
  childExitCode = c;
});

process.on('exit', function() {
  assert.ok(childExitCode == 0);
});
