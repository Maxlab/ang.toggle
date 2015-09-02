(function() {


  "use strict";

  angular.module('ngFit.contact', ['ngRoute'])
  .config(configContact)
  .controller('ContactCtrl',ContactCtrl);

  configContact.$inject = ['$routeProvider'];
  function configContact($routeProvider) {
    $routeProvider.when('/contact',{
      templateUrl: 'app/components/contact/contact.html',
      controller: 'ContactCtrl',
      controllerAs: 'vm'
    });
  }

  ContactCtrl.$inject = ['$rootScope'];
  function ContactCtrl($rootScope) {
    $rootScope.curPath = 'contact';
    this.title = 'Contact - My name is Nikolay';
    this.sayHello = function() {
      alert('Hi, Nikolay!');
    }
  }


})();