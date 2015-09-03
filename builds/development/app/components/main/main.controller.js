//best practice code style
(function() {

  "use strict";

  angular.module('ngFit.main', ['ngRoute'])
    .config(configMain)
    .controller('MainCtrl',MainCtrl)
    .filter('onlyData',function() {
      return function(input) {
        input = input || [];
        var out = [];
        angular.forEach(input, function(v, k) {
          if(!isNaN(k/1)) {
            out.push(v);
          }
        });
        return out;
      };
    })
  ;

  configMain.$inject = ['$routeProvider','$logProvider'];
  function configMain($routeProvider,$logProvider) {
    $logProvider.debugEnabled(true);
    $routeProvider.when('/',{
      templateUrl: 'app/components/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm'
    });
  }

  MainCtrl.$inject = ['$rootScope','$log','$localStorage'];
  function MainCtrl($rootScope,$log,$localStorage) {
    var self = this;
    $rootScope.curPath = 'main';

    self.title = 'Toggles';
    self.toggles = $localStorage;
    self.toggle = {
      title: 'Name',
      pricePerSeconds: 0
    };

    self.addToggle = function() {

      var id = (Object.keys($localStorage).length - 4) + 1;

      $localStorage[id] = {
        id: id,
        time: 0,
        priceForAllTime: 0
      };

      $localStorage[id].title = self.toggle.title;
      $localStorage[id].pricePerSeconds = self.toggle.pricePerSeconds;
      self.toggle = {
        title: 'Name',
        pricePerSeconds: 0
      };
    };

    self.deleteToggle = function(v) {
      delete $localStorage[v.id];
    };

  }


})();