const { wrapper } = require('../wrapper');
const assert = require('assert');

describe('SOCKET API', function() {
  describe('Request wrapper', function() {
    it('should return an string', function() {
      assert.equal(wrapper('/test',{data:true}), '/test\n{"data":true}\n');
    });
  });
});