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

  var buffered = [];
  stream.on('data', function (data) {
    data = data.toString();

    var NUL = "\0";
    for (var nulpos=data.indexOf(NUL), i=0, l=data.length;
         i < l;
         i=nulpos+1, nulpos=data.indexOf(NUL, i)) {

      if (nulpos == -1) {
        buffered.push(data.slice(i, data.length));
        break;
      }
      else {
        var s = data.slice(i, nulpos);
        if (!s) continue;
        buffered.push(s);

        // append to buffered a slice of the string
        var msg = JSON.parse(buffered.join(""));
        buffered = [];
        process.emit('message', msg);
      }
    }
  });

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
