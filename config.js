var fs = require('fs');
var environment = process.env.NODE_ENV || 'development'

var config = {
    calculationInterval: 500,
    
    mock: {
      enabled: false,
      interval: 100,
      weight: 0
    },
    
    discriminator: {
        host: 'localhost',
        port: 20100
    }
}

config.credentials = {
  twitter: {
    user: process.env.TWITTER_USER,
    password: process.env.TWITTER_PASSWORD
  }
}

exports.Config = config