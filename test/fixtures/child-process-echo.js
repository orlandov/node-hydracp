process.on('message', function(m) {
  process.send(m);
//   process.exit();
});
