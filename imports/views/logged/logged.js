import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngSanitize from 'angular-sanitize';

import template from './logged.html';

class Logged {
  constructor($scope, $reactive, $rootScope, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    $rootScope.showThat = false;
    this.rut = $rootScope;
    $timeout(function(){
        $rootScope.showThat = true;
    }, 100);
  }
}

const name = 'logged';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ngSanitize
]).component(name, {
  template,
  controllerAs: name,
  controller: Logged
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('logged', {
      abstract: true,
      url: '',
      template: '<logged></logged>',
      resolve:{
        checkLogin: ['$state', '$timeout' , function($state, $timeout){
          $timeout(function(){
            if(!localStorage.getItem('Meteor.loginToken')){
              $state.go('loggedOut');
            } else{
            }
          },0);
        }]
      }
    });
}
