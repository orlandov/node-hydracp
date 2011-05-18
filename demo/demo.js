var fork = require('../lib/hydracp').fork;

var child = fork(__dirname + '/child.js', ['some', 'args']);

child.send({ hello: 'world' });

child.on('message', function (msg) {
  console.log("Got a message from the little baby");
  console.dir(msg);
});
