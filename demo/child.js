console.log("In the child");
process.send({ ping: 'pong' });

process.on('message', function (msg) {
  console.log("Yep got message");
  console.dir(msg);
  setTimeout(function () {
    process.exit();
  }, 2000);
});
