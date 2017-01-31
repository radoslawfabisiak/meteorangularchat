import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './register.html';

class Register {
  constructor($scope, $reactive, $state, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.register = function(login){
      Accounts.createUser({
        username: login.email,
        email: login.email,
        password: login.password,
        profile:{
          profilePhoto: 'http://localhost:3000/img/default-photo.png'
        }
      }, function(err){
        if(err){
          console.log(err);
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

const name = 'register';

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: Register
});
