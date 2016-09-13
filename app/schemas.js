'use strict'

module.exports = function(code){
    'use strict'
    
    let status = require('./config')(code).status;

    if (status === 'test' || status === 'ani') {
      return require('./models/' + "test");
    }
    else {
      return require('./models/' + code);
    }

}
