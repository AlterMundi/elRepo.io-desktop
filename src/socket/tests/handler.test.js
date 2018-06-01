const { handler } = require('../handler');
const assert = require('assert');

let hd = handler();

describe('SOCKET API', function() {

  describe('Request handler', function() {

    const register1 = hd.register();
    const register2 = hd.register();
    
    it('should return a promise', function() {
      assert.equal(typeof register1, 'object');
      assert.equal(typeof register2, 'object');
    });

    it('respond the promise on success', function() {
        const mockData = { data: 'ok' }
        const mockErr = {err: 'Not found'}
        register1
            .then(data => { assert.deepEqual(data, mockData)})
            .catch(err => { assert.equal(err, undefined) })

        hd.respond(null, mockData)
    });

    it('respond the promise on fail', function() {
        const mockErr = {err: 'Not found'}
        register2
            .then(data => { assert.equal(data, undefined)})
            .catch(err => { assert.equal(err, mockErr) })

        hd.respond(mockErr)
    });

    it('Return error if callback not exist', function() {
        const mockErr = {err: 'Not found'}
        hd.respond({})
            .catch(err => assert.equal(err, 'not found'))
    });

  });

});