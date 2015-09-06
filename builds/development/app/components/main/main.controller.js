//best practice code style
(function() {

  "use strict";

  angular.module('ngFit.main', ['ngRoute'])
    .config(configMain)
    .controller('MainCtrl',MainCtrl)
    .service('getUniqIdfromLocalStorage',function($localStorage) {
      return function() {
        var slice = Object.keys($localStorage).slice(0,-4);
        slice = slice.sort(function (a, b) {
          if (Number(a) > Number(b)) return 1;
          if (Number(a) < Number(b)) return -1;
          return 0;
        });

        return (slice.length > 0) ? Number(slice[slice.length - 1]) + 1 : 0;

      };
    })
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
    .filter('toTimeHHMMSS',function() {
      return function(num) {
        num = Number(num) || 0;

        var sec_num = parseInt(num, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        return hours+':'+minutes+':'+seconds;
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

  MainCtrl.$inject = ['$scope','$rootScope','$log','$localStorage','servClock','getUniqIdfromLocalStorage'];
  function MainCtrl($scope,$rootScope,$log,$localStorage,servClock,getUniqIdfromLocalStorage) {
    var self = this;
    $rootScope.curPath = 'main';

    self.title = 'Задачи';
    self.toggles = $localStorage;
    self.toggle = {
      title: null,
      timeEnd: null,
      priceTask: null
    };
    self.handle = [];
    self.interval = [];

    // Toggle methods
    self.addToggle = function() {

      var id = getUniqIdfromLocalStorage($localStorage);
      $localStorage[id] = {
        id: id,
        title: self.toggle.title || 'Без названия',
        timeEnd: self.toggle.timeEnd || 0,
        timeSpended: self.toggle.timeEnd,
        priceTask: self.toggle.priceTask || 0,
        spended: 0,
        timerRunning: false
      };
      self.toggle = {
        title: null,
        timeEnd: null,
        priceTask: null
      };
    };
    self.deleteToggle = function(v) {
      delete $localStorage[v.id];
    };


    // Timer methods
    self.timerStart = function (v){
      self.handle[v.id] = servClock(v.id);
      self.handle[v.id].start();
      self.interval[v.id] = setInterval(function () {
        $scope.$apply(function(){
          if($localStorage[v.id].timeSpended > 0) {
            $localStorage[v.id].timeSpended -= 1;
            $localStorage[v.id].spended += ($localStorage[v.id].priceTask / $localStorage[v.id].timeEnd);
          } else {
            self.timerReset(v);
          }
        });
      }, 1000);
      $localStorage[v.id].timerRunning = true;
    };
    self.timerReset = function(v) {
      $localStorage[v.id].timeSpended = $localStorage[v.id].timeEnd;
      $localStorage[v.id].spended = 0;
      self.timerStop(v);
    };
    self.timerStop = function (v){
      if(self.handle[v.id]) {
        self.handle[v.id].stop(v.id);
        delete self.handle[v.id];
        clearInterval(self.interval[v.id]);
        $localStorage[v.id].timerRunning = false;
      }
    };

  }






})();