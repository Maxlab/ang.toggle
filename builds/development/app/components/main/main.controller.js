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
    });


  configMain.$inject = ['$routeProvider','$logProvider'];
  function configMain($routeProvider,$logProvider) {
    $logProvider.debugEnabled(true);
    $routeProvider.when('/',{
      templateUrl: 'app/components/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm'
    });
  }

  MainCtrl.$inject = ['$scope','$rootScope','$log','$localStorage','servClock'];
  function MainCtrl($scope,$rootScope,$log,$localStorage,servClock) {
    var self = this;
    $rootScope.curPath = 'main';

    self.title = 'Toggles';
    self.toggles = $localStorage;
    self.toggle = {
      title: 'Name',
      pricePerSeconds: 0
    };
    self.handle = [];
    self.interval = [];


    self.addToggle = function() {

      //todo move to service getUniqId
      var slice = Object.keys($localStorage).slice(0,-4);
      slice = slice.sort(function (a, b) {
        if (Number(a) > Number(b)) return 1;
        if (Number(a) < Number(b)) return -1;
        return 0;
      });
      var id = Number(slice[slice.length - 1]) + 1;
      //todo end

      $localStorage[id] = {
        id: id,
        title: self.toggle.title,
        time: 0,
        pricePerSeconds: self.toggle.pricePerSeconds,
        priceForAllTime: 0,
        timerRunning: false
      };
      self.toggle = {
        title: 'Name',
        pricePerSeconds: 0
      };
    };
    self.deleteToggle = function(v) {
      delete $localStorage[v.id];
    };


    self.timerStart = function (v){
      $log.debug(servClock);
      self.handle[v.id] = servClock(v.id);
      self.handle[v.id].start();
      self.interval[v.id] = setInterval(function () {
        $scope.$apply(function(){
          $localStorage[v.id].time = self.handle[v.id].getTotal();
          $localStorage[v.id].priceForAllTime = $localStorage[v.id].time * $localStorage[v.id].pricePerSeconds;
        });
      }, 1000);
      $localStorage[v.id].timerRunning = true;
    };
    self.timerStop = function (v){
      self.handle[v.id].stop(v.id);
      clearInterval(self.interval[v.id]);
      $localStorage[v.id].timerRunning = false;
    };

  }






})();