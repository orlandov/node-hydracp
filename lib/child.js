var net = require('net')
  , path = require('path')
  , common = require('./common')

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

  var handler = function (chunk) {
    process.emit('message', chunk);
  }

  stream.on('data', common.createJsonChunkParser(handler));

  process.send = function (msg) {
    stream.write(JSON.stringify(msg) + "\0");
  }
  
  var file = process.argv[2];
  process.argv.splice(1, 1);

  stream.resume();

  var filename = path.resolve(file);
  var m = require(filename);
  if (!m) 
    throw new Error("Could not load child source: " + filename);
});

stdin.resume();		
