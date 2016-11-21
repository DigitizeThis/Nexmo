'use strict';

describe('Messagings E2E Tests:', function () {
  describe('Test Messagings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/messagings');
      expect(element.all(by.repeater('messaging in messagings')).count()).toEqual(0);
    });
  });
});
