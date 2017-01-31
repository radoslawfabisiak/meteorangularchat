import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './logged-out.html';

class LoggedOut {
  constructor($scope, $reactive, $timeout, $state, $rootScope) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({

    });
    $rootScope.showThat = false;
    this.rut = $rootScope;
    $timeout(function(){
        $rootScope.showThat = true;
        // console.log('true')
    }, 100);

  }
}

const name = 'loggedOut';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  template,
  controllerAs: name,
  controller: LoggedOut
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('loggedOut', {
      url: '/',
      template: '<logged-out></logged-out>',
      resolve:{
        checkLogin: ['$state', '$timeout' , function($state, $timeout){
          $timeout(function(){
            if(localStorage.getItem('Meteor.loginToken')){
              // console.log('logged');
              $state.go('logged.home');
            } else{
              // console.log('logged out');
            }
          },0);
        }]
      }
    });
}
