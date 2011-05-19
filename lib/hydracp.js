var net = require('net')
  , spawn = require('child_process').spawn
	, socketpair = process.binding('net').socketpair
  , path = require('path');

exports.fork = function (file, args, options) {
  var childSocketpair = socketpair();

  var childArgs = [ path.join(__dirname, 'child.js'), file ];
  if (args && Array.isArray(args)) {
    childArgs.push.apply(childArgs, args);
  }

  var child = spawn
            ( process.execPath
            , childArgs
            , process.env
            , [childSocketpair[1], 1, 2]
            );

  // Tragically kill children when parent dies.
  var signals = ['SIGINT', 'SIGTERM', 'SIGKILL', 'SIGQUIT', 'SIGHUP', 'exit'];
  signals.forEach(function (signal) {
    process.on(signal, function () {
      try {
        child.kill();
      }
      catch (e) {
      }

      if (signal !== 'exit' && signal !== 'SIGHUP') {
        process.exit();
      }
    });
  });

  child.channel = new net.Stream(childSocketpair[0], 'unix');

  var parentChildSocketpair = socketpair();
  var stream = new net.Stream(parentChildSocketpair[0], 'unix');

  stream.resume();

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
        child.emit('message', msg);
      }
    }
  });

  child.on('exit', function () {
    child.channel.destroy();
    stream.destroy();
  });

  child.send = function (msg) {
    stream.write(JSON.stringify(msg)+"\0");
  };

  child.channel.write('parent', 'utf8', parentChildSocketpair[1]);

  return child;
}
