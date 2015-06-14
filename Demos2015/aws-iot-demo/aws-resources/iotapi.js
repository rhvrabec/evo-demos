// Lambda function acting as API endpoint for Evothings IoT Example

console.log('Loading function');

var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');

var cw = new AWS.CloudWatch();
var doc = new DOC.DynamoDB();

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    switch(event.operation) {
        case 'update':
            update(event.sensorid, event.value, context);
            break;
        case 'query':
            query(event.sensorid, context);
            break;
    }

};

var update = function(sensorid, value, context) {
    
    var itemParams = {
        TableName: 'SensorData',
        Item: {
            SensorId: sensorid,
            Timestamp: new Date().toISOString(),
            Value: value
        }};
    
    doc.putItem(itemParams, function(err, data) {
      if (err) {
        console.log('DDB call failed: ' + err, err.stack);
        context.error(err);
      } else {
        
        //if all is well - also log the metric to CloudWatch
        logMetric(sensorid, value, function(err, data) {
          if (err) {
            console.log('CW call failed: ' + err, err.stack);
            context.error(err);
          } else {
            context.succeed();
          }
        });
      }
    });
}

var logMetric = function(sensorid, value, callback) {
    var params = {
      MetricData: [{
          MetricName: 'SensorData',
          Dimensions: [{ Name: 'SensorId', Value: sensorid }],
          Timestamp: new Date(),
          Value: value
        }],
      Namespace: 'Sensors'
    };

    cw.putMetricData(params, callback);
}

var query = function(sensorid, context) {
    var params = {
        TableName: 'SensorData',
        Limit: 20,                  //return the 20...
        ScanIndexForward: false,    //... most recent items
        KeyConditions: [doc.Condition('SensorId', 'EQ', sensorid)]
    };
    
    doc.query(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            context.fail(err);
        }
        else {
            console.log(data);           // successful response
            context.succeed(data);
        }
    });
    
}

