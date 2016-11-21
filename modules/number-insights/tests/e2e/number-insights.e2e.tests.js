'use strict';

describe('Number insights E2E Tests:', function () {
  describe('Test Number insights page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/number-insights');
      expect(element.all(by.repeater('number-insight in number-insights')).count()).toEqual(0);
    });
  });
});
