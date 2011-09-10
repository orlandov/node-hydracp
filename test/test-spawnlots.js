var assert = require('assert');
var fork = require('../lib/hydracp').fork;

var childScript = __dirname + '/fixtures/child-process-fork-node.js';

var i = 100;
while (i--) {
  var n = fork(childScript, [4,2,0]);
  console.log("Spawned " + n.pid);
  n.send({hello:1});
  n.on('exit', function () {
    console.log("Child exited.");
  });
}

console.log("Sleeping 30s");
setTimeout(function () {
}, 30000);
