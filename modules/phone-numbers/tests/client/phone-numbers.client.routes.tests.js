(function () {
  'use strict';

  describe('Phone numbers Route Tests', function () {
    // Initialize global variables
    var $scope,
      PhoneNumbersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PhoneNumbersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PhoneNumbersService = _PhoneNumbersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('phone-numbers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/phone-numbers');
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
          PhoneNumbersController,
          mockPhoneNumber;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('phone-numbers.view');
          $templateCache.put('modules/phone-numbers/client/views/view-phone-number.client.view.html', '');

          // create mock Phone number
          mockPhoneNumber = new PhoneNumbersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Phone number Name'
          });

          // Initialize Controller
          PhoneNumbersController = $controller('PhoneNumbersController as vm', {
            $scope: $scope,
            phoneNumberResolve: mockPhoneNumber
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:phoneNumberId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.phoneNumberResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            phoneNumberId: 1
          })).toEqual('/phone-numbers/1');
        }));

        it('should attach an Phone number to the controller scope', function () {
          expect($scope.vm.phoneNumber._id).toBe(mockPhoneNumber._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/phone-numbers/client/views/view-phone-number.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PhoneNumbersController,
          mockPhoneNumber;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('phone-numbers.create');
          $templateCache.put('modules/phone-numbers/client/views/form-phone-number.client.view.html', '');

          // create mock Phone number
          mockPhoneNumber = new PhoneNumbersService();

          // Initialize Controller
          PhoneNumbersController = $controller('PhoneNumbersController as vm', {
            $scope: $scope,
            phoneNumberResolve: mockPhoneNumber
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.phoneNumberResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/phone-numbers/create');
        }));

        it('should attach an Phone number to the controller scope', function () {
          expect($scope.vm.phoneNumber._id).toBe(mockPhoneNumber._id);
          expect($scope.vm.phoneNumber._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/phone-numbers/client/views/form-phone-number.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PhoneNumbersController,
          mockPhoneNumber;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('phone-numbers.edit');
          $templateCache.put('modules/phone-numbers/client/views/form-phone-number.client.view.html', '');

          // create mock Phone number
          mockPhoneNumber = new PhoneNumbersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Phone number Name'
          });

          // Initialize Controller
          PhoneNumbersController = $controller('PhoneNumbersController as vm', {
            $scope: $scope,
            phoneNumberResolve: mockPhoneNumber
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:phoneNumberId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.phoneNumberResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            phoneNumberId: 1
          })).toEqual('/phone-numbers/1/edit');
        }));

        it('should attach an Phone number to the controller scope', function () {
          expect($scope.vm.phoneNumber._id).toBe(mockPhoneNumber._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/phone-numbers/client/views/form-phoneNumber.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
