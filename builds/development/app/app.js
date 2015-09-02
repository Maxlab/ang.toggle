// initialize material design js
$.material.init();

(function() {

  "use strict";

  angular
    .module(
      'ngFit', [
      'ngFit.main',
      'ngFit.contact',
      'ngFit.about',
      'ngFit.service.firebase'
    ])
    .value('appVars',{
      firebase_url: 'https://boiling-fire-9514.firebaseio.com/'
    })
  ;

})();

