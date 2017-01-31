import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './login.html';

class Login {
  constructor($scope, $reactive, $state, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.login = function(login){
      Meteor.loginWithPassword(login.email, login.password, function(error, result){
        if(error){
          console.log(error);
        } else{
          $timeout(function(){
            let userId = Meteor.userId();
            Meteor.users.update({_id: userId},{
              $set:{
                "profile.online":true
              }
            });
            Meteor.users.update({_id: userId},{
              $set:{
                "profile.lastLogin": new Date()
              }
            });
            $state.go('logged.home');
          },100)
        }
      });
    }
  }
}

const name = 'login';

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: Login
});
