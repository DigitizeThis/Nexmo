'use strict';

describe('Phone numbers E2E Tests:', function () {
  describe('Test Phone numbers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/phone-numbers');
      expect(element.all(by.repeater('phone-number in phone-numbers')).count()).toEqual(0);
    });
  });
});
