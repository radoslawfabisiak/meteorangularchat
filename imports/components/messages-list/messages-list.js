import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Talks } from '../../api/talks';

import template from './messages-list.html';

class MessagesList {
  constructor($scope, $reactive, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('talks');
    this.subscribe('users');

    this.helpers({
      user(){
        return Meteor.user();
      },
      talks() {
        let talks = [];
        Talks.find({
          users:{
            "$in": [Meteor.userId()]
          }
        }).forEach(function(talk){
          if(talk.user1._id == Meteor.userId()){
            talk.with = talk.user2;
          } else{
            talk.with = talk.user1;
          }
          let toPushWith = Meteor.users.findOne({_id: talk.with._id});

          if(toPushWith){
            for(i = 0; i < talk.messages.length; i++){
              talk.lastMessage = '';
              talk.lastMessage = talk.messages[i].body;
            }
            talk = {
              talkId: talk._id,
              with:{
                username: talk.with.username,
                profilePhoto: toPushWith.profile.profilePhoto,
                online: toPushWith.profile.online,
              },
              lastMessage: talk.lastMessage
            }
            if(talk.lastMessage){
              talks.push(talk);
            }
          }
        });
        return talks;
      }
    });
  }
}

const name = 'messagesList';

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: MessagesList
});
