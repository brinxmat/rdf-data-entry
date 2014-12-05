(function() {
  var app = angular.module('type-data', ['$http',function($http){
    app.directive("typeData", function() {
      return {
        restrict: 'E',
        templateUrl: "/app/templates/type-data.html"
      };
    });
}]);


})();
