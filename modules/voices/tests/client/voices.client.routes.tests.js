(function () {
  'use strict';

  describe('Voices Route Tests', function () {
    // Initialize global variables
    var $scope,
      VoicesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VoicesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VoicesService = _VoicesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('voices');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/voices');
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
          VoicesController,
          mockVoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('voices.view');
          $templateCache.put('modules/voices/client/views/view-voice.client.view.html', '');

          // create mock Voice
          mockVoice = new VoicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Voice Name'
          });

          // Initialize Controller
          VoicesController = $controller('VoicesController as vm', {
            $scope: $scope,
            voiceResolve: mockVoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:voiceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.voiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            voiceId: 1
          })).toEqual('/voices/1');
        }));

        it('should attach an Voice to the controller scope', function () {
          expect($scope.vm.voice._id).toBe(mockVoice._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/voices/client/views/view-voice.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VoicesController,
          mockVoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('voices.create');
          $templateCache.put('modules/voices/client/views/form-voice.client.view.html', '');

          // create mock Voice
          mockVoice = new VoicesService();

          // Initialize Controller
          VoicesController = $controller('VoicesController as vm', {
            $scope: $scope,
            voiceResolve: mockVoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.voiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/voices/create');
        }));

        it('should attach an Voice to the controller scope', function () {
          expect($scope.vm.voice._id).toBe(mockVoice._id);
          expect($scope.vm.voice._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/voices/client/views/form-voice.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VoicesController,
          mockVoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('voices.edit');
          $templateCache.put('modules/voices/client/views/form-voice.client.view.html', '');

          // create mock Voice
          mockVoice = new VoicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Voice Name'
          });

          // Initialize Controller
          VoicesController = $controller('VoicesController as vm', {
            $scope: $scope,
            voiceResolve: mockVoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:voiceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.voiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            voiceId: 1
          })).toEqual('/voices/1/edit');
        }));

        it('should attach an Voice to the controller scope', function () {
          expect($scope.vm.voice._id).toBe(mockVoice._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/voices/client/views/form-voice.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
