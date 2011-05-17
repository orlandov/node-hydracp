var net = require('net')
  , path = require('path');

var stdin = new net.Stream(0, 'unix');
var fdType;

stdin.on('data', function (message){
  fdType = message;
});

stdin.on('fd', function (fd) {
  if (fdType.toString() !== "parent") {
    throw new Error("Invalid file descriptor type, " + fdType );
  }

  var stream = new net.Stream(fd, "unix");

  stream.on('data', function (data) {
    var msg = JSON.parse(data.toString());
    process.emit('message', msg);
  });

  process.send = function (msg) {
    stream.write(JSON.stringify(msg));
  }
  
  var file = process.argv[2];
  process.argv.splice(1, 1);
  console.log(file);

  stream.resume();

  require(path.resolve(file));
});

stdin.resume();		
