var bs = require('../lib/node-beanstalkd')
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
    conn.put(0, 0, 1, JSON.stringify(data), function (err, id) {
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

client.on('close', function (has_err) {
  if(has_err) {
    console.log('Connection closed with an error.');
  } else {
    console.log('Connection was closed successfully.');
  }
});