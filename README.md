Beanstalkd Client for Node.js
=============================

Library to produce and consumer jobs for the [beanstalkd](http://kr.github.io/beanstalkd/) work queue. This is a fork of [node-beanstalk-client](https://github.com/benlund/node-beanstalk-client).

Version: 0.3.0

Basic example producing one job and consuming one job:

```js
var bs = require('node-beanstalkd')
  , client = new bs.Client();

client.connect('127.0.0.1:11300', function (err, conn) {
  if(err) {
    console.log('Error connecting to beanstalkd.');
    console.log('Make sure that beanstalkd is running.');
  } else {
    var data = {
      data: {
        name: "node-beanstalkd"
      }
    };
    var priority = 0;
    var delay = 0; // number of seconds delay
    var timeToRun = 1;
    conn.put(priority, delay, timeToRun, JSON.stringify(data), function (err, id) {
      if(err) {
        console.log('Error putting job.');
      } else {
        console.log('Produced Job ' + id);
        conn.reserve(function (err, id, json) {
          if(err) {
            console.log('Error reserving job.');
          } else {
            console.log('Consumed Job ' + id);
            console.log('Job Data: ' + json);
            console.log('Name: ' + JSON.parse(json).data.name);
            conn.destroy(id, function (err) {
              if(err) {
                console.log('Error destroying job.');
              } else {
                console.log('Destroyed Job');
                conn.end();
              }
            });
          }
        });
      }
    });
  }
});
```


Try it (with `beanstalkd` running):

    $ node test/test.js
