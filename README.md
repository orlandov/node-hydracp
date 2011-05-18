# NAME

hydracp - spawn and communicate with child processes in pure javascript

# SYNOPSIS

In the parent:

    var fork = require('../lib/hydracp').fork;

    var child = fork(__dirname + '/child.js', ['some', 'args']);

    child.send({ hello: 'world' });

    child.on('message', function (msg) {
      console.log("Got a message from the little baby");
      console.dir(msg);
    });

In the child:

    console.log("In the child");
    process.on('message', function (msg) {
      console.log("Yep got message");
      console.dir(msg);
      setTimeout(function () {
        process.send({ ping: 'pong' });
      }, 1000);
    });

Running the parent:

    $ node parent.js
    In the child
    Yep got message
    { hello: 'world' }
    Got a message from the little baby
    { ping: 'pong' }

# DESCRIPTION

The `hydracp` library provides a way to lauch child node processes and then send and receive messages. It does not rely on on-disk sockets.

# TODO

- Add ability to create and destroy arbitrary socketpair streams to child processes, particularly binary byte streams.
     
# AUTHOR

Orlando Vazquez <orlando@gmail.com> (http://joyent.com)

# LICENSE

MIT
