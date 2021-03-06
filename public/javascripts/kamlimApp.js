'use strict'
// Name the application and pass in dependencies
var app = angular.module('kamlimApp', ['ui.router', 'ngSanitize']);



// Configure states using UI router
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

	// Remove hashbang URLs
	//$locationProvider.html5Mode(true);
	
	// Home state for the application
	$stateProvider.state('home', {
		url: '/home',
		views: {
			// Default view
			'': {
				templateUrl: '../templates/home.html',
				controller: 'HomeCtrl'
			},
			// Nested views
			'en_nav@home': {
				templateUrl: '../templates/en_nav.html',
				controller: 'HomeCtrl'
			},
			'kr_nav@home': {
				templateUrl: '../templates/kr_nav.html',
				controller: 'HomeCtrl'
			}
		},
		resolve: {
			// Load all topics and subtopics whenever this state is entered
			topicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getAll();
			}],
			subtopicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getSubtopics();
			}]
		}
	})
	// State to display each page in Korean
	.state('kr_subtopic', {
		url: '/kr/subtopics/{id}',
		views: {
			// Default view
			'': {
				templateUrl: '../templates/kr_subtopic.html',
				controller: 'PageCtrl'
			},
			// Nested views
			'kr_nav@kr_subtopic': {
				templateUrl: '../templates/kr_nav.html',
				controller: 'HomeCtrl'
			}
		},
		resolve: {
			// Load all topics and subtopics whenever this state is entered
			topicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getAll();
			}],
			subtopicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getSubtopics();
			}]
		}
	})
	// State to display each page
	.state('en_subtopic', {
		url: '/en/subtopics/{id}',
		views: {
			// Default view
			'': {
				templateUrl: '../templates/en_subtopic.html',
				controller: 'PageCtrl'
			},
			// Nested views
			'en_nav@en_subtopic': {
				templateUrl: '../templates/en_nav.html',
				controller: 'HomeCtrl'
			}
		},
		resolve: {
			// Load all topics and subtopics whenever this state is entered
			topicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getAll();
			}],
			subtopicPromise: ['TopicFact', function(TopicFact) {
				return TopicFact.getSubtopics();
			}]
		}
	});

	// Other states will route to the home state
	$urlRouterProvider.otherwise('home');

}]);

// Factory to retrieve data from the database and display it on the main website
app.factory('TopicFact', ['$http', function($http) {
	// Arrays to hold all of the topics and subtopics
	var object = {
		topics: [],
		subtopics: []
	};

	// Retrieve all topics from the database
	object.getAll = function() {
		return $http.get('/topics').success(function(data) {
			// Deep copy of the data
			angular.copy(data, object.topics);
		});
	};

	// Retrieve all subtopics from the database
	object.getSubtopics = function() {
		return $http.get('/subtopics').success(function(data) {
			angular.copy(data, object.subtopics)
		});
	};

	return object;
}]);

// Controller to handle the main page
app.controller('HomeCtrl', ['$scope', 'TopicFact', function($scope, TopicFact) {

	// Retrieve topics and subtopics
	$scope.topics = TopicFact.topics;
	$scope.subtopics = TopicFact.subtopics;

}]);

// Controller to handle each subtopic page
app.controller('PageCtrl', ['$scope', '$stateParams', 'TopicFact', function($scope, $stateParams, TopicFact) {
	// Retrieve data for a specific subtopic
	$scope.subtopic = TopicFact.subtopics[$stateParams.id];

}]);
