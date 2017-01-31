import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

const name = 'navigation';

class Navigation {
  constructor($scope, $reactive, $state, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      user() {
        return Meteor.user();
      }
    });

    this.logout = function(){
      let userId = Meteor.userId();
      Meteor.users.update({_id: userId},{
        $set:{
          "profile.online":false
        }
      });
      Meteor.logout();

      $timeout(function(){
        $state.go('loggedOut');
      }, 500);
    }
  }
}

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});
