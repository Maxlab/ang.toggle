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

  MainCtrl.$inject = ['$scope','$rootScope','$log','$localStorage'];
  function MainCtrl($scope,$rootScope,$log,$localStorage) {
    var self = this;
    $rootScope.curPath = 'main';

    self.title = 'Toggles';
    self.toggles = $localStorage;
    self.toggle = {
      title: 'Name',
      pricePerSeconds: 0
    };
    self.handle = Clock();
    self.timerRunning = false;


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


    self.timerStart = function (v){

      self.handle = Clock(v.id);
      self.handle.start();

      self.interval = setInterval(function () {
        $scope.$apply(function(){
          v.time = self.handle.getTotal();
          $log.debug(v.time);
        });
      }, 1000);

      self.timerRunning = true;
    };
    self.timerStop = function (v){
      self.handle.stop(v.id);
      clearInterval(self.interval);
      self.timerRunning = false;
    };

  }


  //todo move to service
  var Clock = function(id){
    var totalSeconds = [];
    var intervals = [];
    return {
      start: function () {
        intervals[id] = setInterval(function () {
          totalSeconds[id] = Number(totalSeconds[id]) + 1;
        }, 1000);
      },

      getTotal: function() {
        return totalSeconds[id];
      },

      stop: function (id) {
        clearInterval(intervals[id]);
        delete intervals[id];
      },

      resume: function () {
        if (!intervals[id]) this.start();
      }
    }
  };



})();