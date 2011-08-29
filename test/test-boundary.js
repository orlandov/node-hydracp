var assert = require('assert');
var common = require('../lib/common');

function parseChunks (chunks, expCount) {
  var count = 0;
  var buffered = [];

  var handler = function (chunk) {
    count++;
    console.log(".");
  }

  var ondata = common.createJsonChunkParser(handler);

  chunks.forEach(ondata);
  assert.equal(count, expCount);
}

parseChunks(
  [ '{"foo":"bar"}\0' ]
, 1
);


parseChunks(
  [ '{"foo":"bar"}\0' 
  , '{"foo":"bar"}\0'
  ]
, 2
);

parseChunks(
  [ '{"foo":"bar"}\0{"foo":"bar"}\0' ]
, 2
);

parseChunks(
  [ '{"foo":"bar"}' ]
, 0
);

parseChunks(
  [ '{"foo":"bar"}'
  , '\0'
  ]
, 1
);

parseChunks(
  [ '{"foo":"bar"}'
  , '\0'
  , '{"foo":"bar"}'
  ]
, 1
);

parseChunks(
  [ '{"foo":"bar"}'
  , '\0'
  , '{"foo":"bar"}'
  , '\0'
  ]
, 2
);

parseChunks(
  [ '{"foo":'
  , '"bar"}'
  , "\0"
  ]
, 1
);

parseChunks(
  [ '{"foo":'
  , '"bar"}'
  , "\0"
  ]
, 1
);
