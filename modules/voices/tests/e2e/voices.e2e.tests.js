'use strict';

describe('Voices E2E Tests:', function () {
  describe('Test Voices page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/voices');
      expect(element.all(by.repeater('voice in voices')).count()).toEqual(0);
    });
  });
});
