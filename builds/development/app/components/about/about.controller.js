(function() {


  "use strict";

  angular.module('ngFit.about', ['ngRoute'])
    .config(configAbout)
    .controller('AboutCtrl', AboutCtrl);

  configAbout.$inject = ['$routeProvider'];
  function configAbout($routeProvider) {
    $routeProvider.when('/about',{
      templateUrl: 'app/components/about/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'vm'
    });
  }

  AboutCtrl.$inject = ['$rootScope'];
  function AboutCtrl($rootScope) {
    $rootScope.curPath = 'about';
    this.title = 'About';

    var a = 5;
    var b = 1;
    var c = b+++c;

    function f(c) {

    }
    console.log(c);

  }
  
  
})();

