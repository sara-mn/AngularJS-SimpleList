//Create the AngularJS module named StorageService
//Create getLocalStorage service to access Updateusers and getusers method  
var storageService = angular.module('storageService', []);
storageService.factory('getLocalStorage', function () {
  var userList = {};
  var user = {
    'id': '',
    'firstName': '',
    'lastName': '',
    'email': '',
    'mobile': ''
  };
  return {
    list: userList,
    updateusers: function (usersArr) {
      if (window.localStorage && usersArr) {
        //Local Storage to add Data  
        localStorage.setItem("users", angular.toJson(usersArr));
      }
      userList = usersArr;
    },
    getusers: function () {
      //Get data from Local Storage  
      userList = angular.fromJson(localStorage.getItem("users"));

      return userList ? userList : [];
    },
    getuserforEdit : function (myuser) {  
      //Get data from Local Storage  
      debugger;
      user = angular.fromJson(localStorage.getItem(myuser));                         
      return user ? user : {};  
    } 
  };
});
var mainService = angular.module('mainService', ['storageService']);
mainService.factory('mainDataFactory', function (getLocalStorage) {
  var str = 'firstName';
  return {
    choosenCol: str,
    chooseOrderBy: function (k) {
      str = k;
    },
    users: getLocalStorage.getusers(),
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  };
});
////// Inject storageService to myApp
var app = angular.module("myApp", ['storageService', 'mainService', 'ngRoute']); 

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "userListTable.html",
      controller: "myCtrl",
    })
    .when("/add", {
      templateUrl: "userDataForm.html",
      controller: "addCtrl",
    })
    .when("/edit/:_id", {
      templateUrl: "editDataForm.html",
      controller: "editCtrl",
    })
    ;
});

app.controller("myCtrl", ['$scope', 'mainDataFactory', 'getLocalStorage', '$routeParams',
  function ($scope, mainDataFactory, getLocalStorage, $routeParams) {
    
    $scope.users = mainDataFactory.users;
    $scope.count = mainDataFactory.users.length;
    $scope.chooseOrderBy = mainDataFactory.chooseOrderBy($scope.choosenCol);

    //Delete user    
    $scope.deleteuser = function (_user) {
      $scope.users.splice($scope.users.indexOf(_user), 1);
      getLocalStorage.updateusers($scope.users);
      $scope.count = $scope.users.length;
    };

  }]);

app.controller("addCtrl", ['$scope', 'mainDataFactory', 'getLocalStorage', '$routeParams','$location',
  function ($scope, mainDataFactory, getLocalStorage, $location) {
    
    $scope.enterId = function () {
      return Math.random().toString(36).substr(2, 9); 
    }
    // Add User
    $scope.adduser = function () {
      $scope.users = mainDataFactory.users;
      $scope.users.push({'id': /*$scope.$id*/ $scope.enterId() , 'firstName': $scope.firstName, 'lastName': $scope.lastName, 'email': $scope.email, 'mobile': $scope.mobile });
      getLocalStorage.updateusers($scope.users);
      $scope.firstName = '';
      $scope.lastName = '';
      $scope.email = '';
      $scope.mobile = '';
      $scope.count = $scope.users.length;
      $location.path('/');
    };

  }]);

app.controller("editCtrl", ['$scope', 'mainDataFactory', 'getLocalStorage', '$routeParams', '$filter' , '$location',
  function ($scope, mainDataFactory, getLocalStorage, $routeParams , $filter,$location) {

    var userId = $routeParams._id;
    $scope.users = mainDataFactory.users;

    //var _user = $filter('filter')($scope.users, { 'id' : userId})[0];
    var _user = $scope.users.filter( e => e.id == userId)[0];
    $scope.thisUser = _user;
    //Edit User
    $scope.edituser = function () {
      var myuser = getLocalStorage.getuserforEdit(_user);  
      myuser.firstName = $scope.thisUser.firstName;
      myuser.lastName = $scope.thisUser.lastName;
      myuser.email = $scope.thisUser.email;
      myuser.mobile = $scope.thisUser.mobile;
      getLocalStorage.updateusers($scope.users);
      $location.path('/');
    };

  }]);