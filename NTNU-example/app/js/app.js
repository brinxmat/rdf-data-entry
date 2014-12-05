(function() {
  var myApp = angular.module('myApp', ['ui.bootstrap']);

  myApp.factory('Data', function () {
    return formdata = {};
  });

  myApp.factory('Share', function () {
	return data = [];
  });

  myApp.factory('ChangeService', [function () {
	return {
		generateUri : function (id) {
			return 'http://www.ntnu.no/ub/digital/document/' + id;
		},
		generateCanonicalUri : function (id) {
			return 'http://ubit.fillager.bibsys.no/fsi/viewer/fsi.swf?cfg=pages_presets%2Fhard_cover_book&pages_dir=Publisering%2F' + id + '&skin=black&language=english&effects=sharpen%3D30%2526quality%3D80&viewerborder=0A0000&pages_bendeffect=Matte&roundedskincorners=0&plugins=resize,fullscreen';
		},
		todaysDate : function () {
			return new Date();
		} 
	}
  }]);

  myApp.factory('BuildSelect', ['$http', function ($http){
	return {
		getResource : function (dataUrl) {
//			$http.get('http://isko.bibsys.no:8080/gunnerus-data-converter/webresources/responsibility?callback=JSON_CALLBACK').success(function (data, status,headers, config) {alert(data);});
			$http({method: 'get', url: dataUrl})
			.success( function (data, status,headers, config) {
				return data;
			});
		}
  	}
  }]);



  myApp.controller('EditorController',  ['$scope', '$http','Data', 'ChangeService', 'BuildSelect', function($scope, $http, Data, ChangeService, BuildSelect){
		$scope.formdata = Data;
		$scope.change = ChangeService;

		//Get the genres

		$scope.genre = [];

		$http({method: 'jsonp', url: 'http://isko.bibsys.no:8080/gunnerus-data-converter/genre?callback=JSON_CALLBACK'})
		.success( function (data, status,headers, config) {
			$scope.genre = data;
			data = null;
		});
		
		//get formats
		$scope.formats = [];

		$http({method: 'jsonp', url: 'http://isko.bibsys.no:8080/gunnerus-data-converter/format?callback=JSON_CALLBACK'})
		.success( function (data, status,headers, config) {
			$scope.formats = data;
			data = null;
		});
		
		//get people
		$scope.people = [];

		$http({method: 'jsonp', url: 'http://isko.bibsys.no:8080/gunnerus-data-converter/responsibility?callback=JSON_CALLBACK'})
		.success( function (data, status,headers, config) {
			$scope.people = data;
			data = null;
		});

	}]);

  myApp.factory('SearchService', ['$http',function ($http) {
	return {
	}
  }]);

  myApp.controller('PaneController', ['$scope','$modal', '$http', 'Data', function ($scope, $modal, $http, Data) {
	$scope.formdata = Data;
	
	this.open = function (pane) {
		var modalInstance = $modal.open({
			templateUrl: 'app/templates/' + pane + '-pane-data.html',
			controller: 'ModalInstanceCtrl',
			size: 'lg'
		});
	};
  }]);

  myApp.controller('GeographicalCtrl', ['$scope', 'Data', 'Share', '$http',function($scope, Data, Share, $http) {
	$scope.formdata = Data;
	$scope.share = Share;

	this.addTerm = function (relation, model) {
		if (!(relation in $scope.formdata)) {
			$scope.formdata[relation] = [];
		}
		$scope.formdata[relation].push(model);
	};
	
	this.removeTerm = function (relation,index) {
		$scope.formdata[relation].splice(index,1);	
	}
	
	var geoPlaces = [];
	
	this.search = function (term){
			var searchString = encodeURIComponent(term);
			var url = 'http://api.geonames.org/searchJSON?q=' + searchString + '&maxRows=10&username=ntnuubsc&callback=JSON_CALLBACK';
			$http.jsonp(url)
		    .success(function(data){
				geoPlaces = data.geonames;
				$scope.share.geoPlaces = geoPlaces
				
		    }
		);
	};
	
  }]);


  myApp.controller('PersonController', ['$scope', 'Data', 'Share', '$http',function($scope, Data, Share, $http) {
	$scope.formdata = Data;
	$scope.share = Share;

	this.addTerm = function (relation, model) {
		if (!(relation in $scope.formdata)) {
			$scope.formdata[relation] = [];
		}
		
		var addToArray=true;
		for(var i=0;i<$scope.formdata[relation].length;i++){
		    if($scope.formdata[relation][i]===model){
		        addToArray=false;
		    }
		}
		if(addToArray){
			$scope.formdata[relation].push(model);			
		}
		else {
			alert("You added that!");
		}

	};

	this.removeTerm = function (relation,index) {
		$scope.formdata[relation].splice(index,1);	
	}

	var people = [];

	this.init = function (){
		var url = 'http://isko.bibsys.no:8080/gunnerus-data-converter/responsibility?callback=JSON_CALLBACK';
		$http.jsonp(url)
	    .success(function(data){
			$scope.share.people = data;

	    }
		);
	};
	
	this.init();

  }]);

  myApp.controller('ModalInstanceCtrl', ['$scope','$modal', '$modalInstance', 'Data', 'SearchService', function ($scope, $modal, $modalInstance, Data, SearchService) {
	  	$scope.ok = function () {
			$modalInstance.close();
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
  }]);	

  myApp.directive("tabs", function($http) {
    return {
      restrict: "E",
      templateUrl: "app/templates/tabs.html",
      controller: function() {
        this.tab = 1;

        this.isSet = function(checkTab) {
          return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
          this.tab = activeTab;
        };
      },
      controllerAs: "tab",
      ngModel: "formdata"
    };
  });

  myApp.directive('itemDescription', function () {

	return {
		restrict: 'E',
      	scope: {ngModel: '='},
		templateUrl: 'app/templates/item-description.html',
		ngModel: 'formdata'
	};
  });

  myApp.directive('geographicalData', function () {

	return {
		restrict: 'E',
      	scope: {ngModel: '='},
		templateUrl: 'app/templates/geographical-data.html',
		ngModel: 'formdata'
	};
  });



})();
