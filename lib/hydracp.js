var net = require("net")
  , spawn = require("child_process").spawn
	, socketpair = process.binding("net").socketpair
  , path = require('path');

exports.spawn = function (file, callback) {
  var child;

  var childSocketpair = socketpair();

  child = spawn
            ( process.execPath
            , [ path.join(__dirname, 'child.js'), file ]
            , process.env
            , [childSocketpair[1], -1, -1]
            );

  var signals = ["SIGINT", "SIGTERM", "SIGKILL", "SIGQUIT", "SIGHUP", "exit"];
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
  
  process.nextTick(function () {
    var parentChildSocketpair = socketpair();
    var stream = new net.Stream(parentChildSocketpair[0], "unix");

    stream.resume();

    stream.on('data', function (data) {
      var msg = JSON.parse(data.toString());
      child.emit('message', msg);
    });

    child.send = function (msg) {
      stream.write(JSON.stringify(msg));
    };

    child.channel.write("parent", "ascii", parentChildSocketpair[1], function () {
      callback(child);
    });
  });
}
