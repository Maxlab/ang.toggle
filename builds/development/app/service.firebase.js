;(function() {

  "use strict";

  angular
    .module('ngFit.service.firebase',['firebase'])
    .service('serviceFirebase', fire);

  fire.$inject = ['$firebaseArray','$log','appVars'];
  function fire($firebaseArray,$log,appVars) {
    var ref = new Firebase(appVars.firebase_url);
    var usersRef = $firebaseArray(ref.child('users'));

    this.getUsers = function() {
      return usersRef;
    };

    this.addUser = function(user) {
      usersRef.$add(user);
    };
  }
})();