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

  stream.on('data', function (data) {
    var msg = JSON.parse(data.toString());
    child.emit('message', msg);
  });

  child.on('exit', function () {
    child.channel.destroy();
    stream.destroy();
  });

  child.send = function (msg) {
    stream.write(JSON.stringify(msg));
  };

  child.channel.write('parent', 'utf8', parentChildSocketpair[1]);

  return child;
}
