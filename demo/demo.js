var spawn = require('../lib/hydracp').spawn;

spawn('./child', function (child) {
  child.send({ hello: 'world' });

  child.on('message', function (msg) {
    console.log("Got a message from the little baby");
    console.dir(msg);
  });

  child.stdout.on('data', function (data) {
    console.log("Got data from child " + data);    
  });
  child.stderr.on('data', function (data) {
    console.log("Got data from child " + data);    
  });
});
