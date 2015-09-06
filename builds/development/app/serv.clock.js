;(function() {

  "use strict";

  angular
    .module('serv.clock',[])
    .service('servClock', clock);

  clock.$inject = [];
  function clock(id){
    return function() {
      if (typeof(id)==='undefined') id = 0;
      var totalSeconds = [];
      var intervals = [];

      return {
        start: function () {
          if(!totalSeconds[id]) totalSeconds[id] = 0;
          intervals[id] = setInterval(function () {
            totalSeconds[id] += 1;
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
  }

})();