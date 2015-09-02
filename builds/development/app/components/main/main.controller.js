//best practice code style
(function() {

  "use strict";

  angular.module('ngFit.main', ['ngRoute'])
    .config(configMain)
    .controller('MainCtrl',MainCtrl)
    .factory('factoryPlusOne',factoryPlusOne) // can return object, a function, or any value
    .service('servicePlusOne',servicePlusOne) // always return object
    .provider('plusOne',providerPlusOne)
    .filter('revert',function() {
      return function(input) {
        input = input || [];
        var out = [];
        angular.forEach(input, function(value, key) {
          out.push(value);
        });
        return out.reverse();
      };
    })
  ;
  // Provider return obj configure on config state
  function providerPlusOne() {
    // private
    var one = 1;
    var sum = 0;
    return {
      // public on config, else private
      plusOne: function(num) {
        sum = num + one;
      },
      $get: function() {
        // public
        return {
          getSum: sum
        }
      }
    }
  }
  // Factory can be an object, a function reference, or any value at all
  function factoryPlusOne() {
    //private
    var one = 1;
    var sum = 0;
    function privatePlusOne(num) {
      sum = num + one;
      return sum;
    }
    //public
    return {
      plusOne: privatePlusOne
    }
  }
  // Service must always be an object
  function servicePlusOne() {
    var one = 1;
    var sum = 0;
    this.plusOne = function(num) {
      sum = one + num;
      return sum;
    }
  }

  configMain.$inject = ['$routeProvider','$logProvider','$provide','plusOneProvider'];
  function configMain($routeProvider,$logProvider,$provide,plusOneProvider) {
    $logProvider.debugEnabled(true);
    $routeProvider.when('/',{
      templateUrl: 'app/components/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm'
    });
    plusOneProvider.plusOne(2);
    $provide.decorator('plusOne',function($delegate) {
      $delegate.getSumPlusTwo = function() {
        return this.getSum + 2;
      }
      return $delegate;
    })
  }

  MainCtrl.$inject = ['serviceFirebase','$rootScope','$log','servicePlusOne','factoryPlusOne','plusOne'];
  function MainCtrl(serviceFirebase,$rootScope,$log,servicePlusOne,factoryPlusOne,plusOne) {
    $rootScope.curPath = 'main';
    var self = this;
    self.title = 'Main page - contrler';
    self.users = serviceFirebase.getUsers();

    self.user = {
      name: null,
      age: 0
    };

    self.addUser = function() {
      serviceFirebase.addUser(self.user);
    };
/*
    $log.debug(servicePlusOne.plusOne(2),'servicePlusOne');
    $log.debug(factoryPlusOne.plusOne(2),'factoryPlusOne');
    $log.debug(plusOne.getSum, 'plusOne.getSum');
    $log.debug(plusOne.getSumPlusTwo(), 'plusOne.getSumPlusTwo');*/
  }


})();