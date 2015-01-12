// This file contains controllers for the pages/tabs of the app

angular.module('starter.controllers', [])

// Controller for info page has no functionality
.controller('InfoCtrl', function($scope) {})

// Controller for page with list of beacons
.controller('BeaconsCtrl', function($scope, $rootScope, Beacons) {
	function startRanging() {
		Beacons.stopRangingBeacons();
		Beacons.startRangingBeacons(beaconsRanged, rangingError);
	}

	function beaconsRanged(beacons) {
		// Update beacon list.
		$scope.$apply(function() {
			$scope.beacons = beacons;
		});

		// Update detail view.
		$rootScope.theDetailScopeUpdateFun && $rootScope.theDetailScopeUpdateFun();
	}

	function rangingError(error) {
		console.log('rangingError ' + error)
	}

	// Use 'deviceready' event to make sure plugins have loaded
	// before starting ranging for beacons.
	document.addEventListener('deviceready', startRanging, false);
})

// Controller for beacon info page
.controller('BeaconDetailCtrl', function($scope, $rootScope, $stateParams, Beacons) {
	function update() {
		$scope.beacon = Beacons.get($stateParams.beaconId);
	}

	$scope.$on('$ionicView.afterEnter', function() {
		// Called when beacons are ranged.
		$rootScope.theDetailScopeUpdateFun = function() {
			$scope.$apply(update);
		};
		// Initial update.
		update();
	});

	$scope.$on('$ionicView.beforeLeave', function() {
		$rootScope.theDetailScopeUpdateFun = null;
	});

})

; // End of angular.module
