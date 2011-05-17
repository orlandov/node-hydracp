console.log("In the worker");
process.on('message', function (msg) {
  console.log("Yep got message");
  console.dir(msg);
  setTimeout(function () {
    process.send({ ping: 'pong' });
  }, 1000);
});
