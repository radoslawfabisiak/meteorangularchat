import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Talks } from '../../api/talks';

import template from './chat-list.html';

class ChatList {
  constructor($scope, $reactive, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('talks');
    this.subscribe('users');

    this.helpers({
      user(){
        return Meteor.user();
      },
      users() {
        let users = [];
        Meteor.users.find({}).forEach(function(user){
          if(user && user._id != Meteor.userId()){
            users.push(user);
          }
        });
        return users;
      }
    });
    this.minimize = function(index){
      $('#chat'+index).addClass('minimalize');
    }
    this.maximize = function(index){
      $('#chat'+index).removeClass('minimalize');
    }

    //Friends online minimalize
    this.minimizeFriends = function(){
      $('.friends-online').addClass('minimalizeFriends');
    }
    this.maximizeFriends = function(){
      $('.friends-online').removeClass('minimalizeFriends');
    }
  }
  startChat(userId){
    let user1 = Meteor.user();
    let user2 = userId;
    let users = [user1._id, user2._id];

    let checkedTalk = Talks.findOne( function() {return ((this.user1._id == user1._id && this.user2._id == user2._id) || (this.user1._id == user2._id && this.user2._id == user1._id))});

    if(checkedTalk){
      if(checkedTalk.user1._id == user1._id){
        Talks.update({_id: checkedTalk._id},{
          $set:{
            'user1.open': true,
            'user1.unread': 0,
            'user1.lastReceived': ''
          }
        })
      } else{
        Talks.update({_id: checkedTalk._id},{
          $set:{
            'user2.open': true,
            'user2.unread': 0,
            'user2.lastReceived': ''
          }
        })
      }
    } else{
      let newTalk = Talks.insert({
        users: users,
        user1: {
          _id: user1._id,
          username: user1.username,
          open: true,
          unread: 0
        },
        user2: {
          _id: user2._id,
          username: user2.username,
          unread: 0
        },
        messages: []
      })
    }
  }
}

const name = 'chatList';

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: ChatList
});
