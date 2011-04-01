var fs = require('fs');
var environment = process.env.NODE_ENV || 'development'

var config = {
    calculationInterval: 500,
    mock: {
      enabled: false,
      interval: 300,
      weight: 0.8
    },
}

// Synchronous, since we only do it once
var credentials = JSON.parse(fs.readFileSync(__dirname + '/credentials', 'utf8'))[environment]
config.credentials = credentials

exports.Config = config