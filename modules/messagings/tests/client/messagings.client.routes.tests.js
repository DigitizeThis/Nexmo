(function () {
  'use strict';

  describe('Messagings Route Tests', function () {
    // Initialize global variables
    var $scope,
      MessagingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MessagingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MessagingsService = _MessagingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('messagings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/messagings');
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
          MessagingsController,
          mockMessaging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('messagings.view');
          $templateCache.put('modules/messagings/client/views/view-messaging.client.view.html', '');

          // create mock Messaging
          mockMessaging = new MessagingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Messaging Name'
          });

          // Initialize Controller
          MessagingsController = $controller('MessagingsController as vm', {
            $scope: $scope,
            messagingResolve: mockMessaging
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:messagingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.messagingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            messagingId: 1
          })).toEqual('/messagings/1');
        }));

        it('should attach an Messaging to the controller scope', function () {
          expect($scope.vm.messaging._id).toBe(mockMessaging._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/messagings/client/views/view-messaging.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MessagingsController,
          mockMessaging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('messagings.create');
          $templateCache.put('modules/messagings/client/views/form-messaging.client.view.html', '');

          // create mock Messaging
          mockMessaging = new MessagingsService();

          // Initialize Controller
          MessagingsController = $controller('MessagingsController as vm', {
            $scope: $scope,
            messagingResolve: mockMessaging
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.messagingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/messagings/create');
        }));

        it('should attach an Messaging to the controller scope', function () {
          expect($scope.vm.messaging._id).toBe(mockMessaging._id);
          expect($scope.vm.messaging._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/messagings/client/views/form-messaging.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MessagingsController,
          mockMessaging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('messagings.edit');
          $templateCache.put('modules/messagings/client/views/form-messaging.client.view.html', '');

          // create mock Messaging
          mockMessaging = new MessagingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Messaging Name'
          });

          // Initialize Controller
          MessagingsController = $controller('MessagingsController as vm', {
            $scope: $scope,
            messagingResolve: mockMessaging
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:messagingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.messagingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            messagingId: 1
          })).toEqual('/messagings/1/edit');
        }));

        it('should attach an Messaging to the controller scope', function () {
          expect($scope.vm.messaging._id).toBe(mockMessaging._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/messagings/client/views/form-messaging.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
