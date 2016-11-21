(function () {
  'use strict';

  describe('Number insights Route Tests', function () {
    // Initialize global variables
    var $scope,
      NumberInsightsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NumberInsightsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NumberInsightsService = _NumberInsightsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('number-insights');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/number-insights');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          NumberInsightsController,
          mockNumberInsight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('number-insights.view');
          $templateCache.put('modules/number-insights/client/views/view-number-insight.client.view.html', '');

          // create mock Number insight
          mockNumberInsight = new NumberInsightsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Number insight Name'
          });

          // Initialize Controller
          NumberInsightsController = $controller('NumberInsightsController as vm', {
            $scope: $scope,
            numberInsightResolve: mockNumberInsight
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:numberInsightId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.numberInsightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            numberInsightId: 1
          })).toEqual('/number-insights/1');
        }));

        it('should attach an Number insight to the controller scope', function () {
          expect($scope.vm.numberInsight._id).toBe(mockNumberInsight._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/number-insights/client/views/view-number-insight.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NumberInsightsController,
          mockNumberInsight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('number-insights.create');
          $templateCache.put('modules/number-insights/client/views/form-number-insight.client.view.html', '');

          // create mock Number insight
          mockNumberInsight = new NumberInsightsService();

          // Initialize Controller
          NumberInsightsController = $controller('NumberInsightsController as vm', {
            $scope: $scope,
            numberInsightResolve: mockNumberInsight
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.numberInsightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/number-insights/create');
        }));

        it('should attach an Number insight to the controller scope', function () {
          expect($scope.vm.numberInsight._id).toBe(mockNumberInsight._id);
          expect($scope.vm.numberInsight._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/number-insights/client/views/form-number-insight.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NumberInsightsController,
          mockNumberInsight;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('number-insights.edit');
          $templateCache.put('modules/number-insights/client/views/form-number-insight.client.view.html', '');

          // create mock Number insight
          mockNumberInsight = new NumberInsightsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Number insight Name'
          });

          // Initialize Controller
          NumberInsightsController = $controller('NumberInsightsController as vm', {
            $scope: $scope,
            numberInsightResolve: mockNumberInsight
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:numberInsightId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.numberInsightResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            numberInsightId: 1
          })).toEqual('/number-insights/1/edit');
        }));

        it('should attach an Number insight to the controller scope', function () {
          expect($scope.vm.numberInsight._id).toBe(mockNumberInsight._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/number-insights/client/views/form-numberInsight.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
