'use strict';

describe('Phone verifications E2E Tests:', function () {
  describe('Test Phone verifications page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/phone-verifications');
      expect(element.all(by.repeater('phone-verification in phone-verifications')).count()).toEqual(0);
    });
  });
});
