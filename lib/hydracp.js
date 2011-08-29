var net = require('net')
var spawn = require('child_process').spawn
var socketpair = process.binding('net').socketpair
var path = require('path')
var common = require('./common')

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

  child.channel = new net.Stream(childSocketpair[0], 'unix');

  var parentChildSocketpair = socketpair();
  var stream = new net.Stream(parentChildSocketpair[0], 'unix');

  stream.resume();

  var buffered = [];

  var handler = function (msg) {
    child.emit('message', msg);
  }

  stream.on('data', common.createJsonChunkParser(handler));

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
