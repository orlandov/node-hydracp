# NAME

hydracp - spawn and communicate with child processes in pure javascript

# SYNOPSIS

In the parent:

    var spawn = require('hydracp').spawn;

    spawn('./child', function (child) {
      child.send({ hello: 'world' });

      child.on('message', function (msg) {
        console.log("Got a message from the little baby");
        console.dir(msg);
      });

      // These work as normal.
      child.stdout.on('data', function (data) {
        console.log("Got data from child " + data);    
      });

      child.stderr.on('data', function (data) {
        console.log("Got data from child " + data);    
      });
    });

In the child:

    console.log("In the worker");
    process.on('message', function (msg) {
      console.log("Yep got message");
      console.dir(msg);
      setTimeout(function () {
        process.send({ ping: 'pong' });
      }, 1000);
    });

Running the parent:

    $ node parent.js
    Got data from child ./child

    Got data from child In the worker
    Yep got message

    Got data from child { hello: 'world' }

    Got a message from the little baby
    { ping: 'pong' }

# DESCRIPTION

The `hydracp` library provides a way to lauch child node processes and then send
and receive messages. It does not rely on on-disk sockets.

# TODO

- Add ability to create and destroy arbitrary socketpair streams to child processes.
     
# AUTHOR

Orlando Vazuqez <orlando@gmail.com>

# LICENSE

MIT
