import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './talk.html';

import { Talks } from '../../api/talks';

class Talk {
  constructor($scope, $reactive, $stateParams) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('talks');
    this.subscribe('users');
    
    this.id = $stateParams.id;

    this.helpers({
      user(){
        return Meteor.userId();
      },
      talk() {
        let chat = {};
        Talks.find({_id: $stateParams.id}).forEach(function(talk){
          if(talk.user1._id == Meteor.userId()){
            chat.with = talk.user2.username;
          } else{
            chat.with = talk.user1.username;
          }
          let messages = [];
          for(i = 0; i < talk.messages.length; i++){
            let sender = Meteor.users.findOne({_id: talk.messages[i].sender._id});
            if(sender){
              talk.messages[i].sender.profilePhoto = sender.profile.profilePhoto;
              messages.push(talk.messages[i]);
            }
          }
          chat.messages = messages;
        });
        return chat;
      }
    });
  }
}

const name = 'talk';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  template,
  controllerAs: name,
  controller: Talk
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('logged.talk', {
      url: '/messages/:id',
      template: '<talk></talk>'
    });
}
