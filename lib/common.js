exports.createJsonChunkParser = function (handler) {
  return (function () {
    var buffer = '';
    var onData = function (data) {
      var chunk, chunks;
      buffer += data.toString();
      chunks = buffer.split('\0');
      while (chunks.length > 1) {
        chunk = chunks.shift();
        var msg;
        try {
          msg = JSON.parse(chunk);
          handler(msg);
        } catch (e) {
          console.log(e.message);
          console.log(e.stack);
          process.nextTick(function () {
            process.exit(1);
          });
        }
      }
      buffer = chunks.pop();
    }

    return onData;
  })();
}
