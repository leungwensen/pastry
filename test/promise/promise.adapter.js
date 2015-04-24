// Adapter for "promises-aplus-tests" test runner

var pastry = require('../../build/nodejs.js'),
    Promise = pastry.Promise;

module.exports = {
    deferred: function() {
        var o = {};
        o.promise = new Promise(function(resolve,reject){
            o.resolve = resolve;
            o.reject = reject;
        });
        return o;
    },
    resolved: function(val) {
        return Promise.resolve(val);
    },
    rejected: function(reason) {
        return Promise.reject(reason);
    }
};

