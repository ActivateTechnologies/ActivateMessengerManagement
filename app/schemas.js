'use strict'

module.exports = function(code){

    let status = require('./config')(code).status;

    if (status === 'test' || status === 'ani') {
      return require('./models/' + test);
    }
    else {
      return require('./models/' + code);
    }
    
}
