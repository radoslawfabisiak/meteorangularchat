import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';

import { Talks } from '../../api/talks';
import { ChatImages } from '../../api/chat-images';

import template from './chat-windows.html';

class ChatWindows {
  constructor($scope, $reactive, $timeout) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('users');
    this.subscribe('talks');
    this.subscribe('images');

    this.helpers({
      user(){
        return Meteor.user();
      },
      openChats(){
        let user1 = Meteor.userId();
        let chats = [];
        Talks.find(
          function() {return ((this.user1._id == user1 && this.user1.open) || (this.user2._id == user1 && this.user2.open))}
        ).forEach(function(chat){
          let messages = [];
          for(i = 0; i < chat.messages.length; i++){
            let sender = Meteor.users.findOne({_id: chat.messages[i].sender._id});
            if(sender){
              chat.messages[i].sender.profilePhoto = sender.profile.profilePhoto;
              messages.push(chat.messages[i]);
            }
          }
          chats.push(chat);
        })
        return chats;
      },
      unread(){
        let user1 = Meteor.userId();
        let all = Talks.find(
          function() {return (this.user1._id == user1 || this.user2._id == user1 )}
        ).fetch();
        let unread = 0;
        for(i = 0; i < all.length; i++){
          if(all[i].user1._id == user1){
            unread =+ all[i].user1.unread;
          } else{
            unread =+ all[i].user2.unread;
          }
        }
        return unread;
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
    this.scrollChatWindow = function(){
      $timeout(function(){
        let user1 = Meteor.userId();
        let openChats = Talks.find(
          function() {return ((this.user1._id == user1 && this.user1.open) || (this.user2._id == user1 && this.user2.open))}
        ).fetch();
        for(i = 0; i < openChats.length; i++){
          let elem = document.getElementById([i] + 'chat-scroll');
          elem.scrollTop = elem.scrollHeight;
        }
      }, 500);
    }
    this.preEmoticons = [":heart:", ":broken_heart:", ":joy:", ":smiley:", ":slight_smile:", ":sweat_smile:", ":laughing:", ":wink:", ":sweat:", ":kissing_heart:", ":stuck_out_tongue_winking_eye:", ":disappointed:", ":angry:", ":cry:", ":persevere:", ":fearful:", ":flushed:", ":dizzy_face:", ":ok_woman:", ":innocent:", ":sunglasses:", ":expressionless:", ":confused:", ":stuck_out_tongue:", ":open_mouth:", ":no_mouth:"];

    this.emoticons = [];

    this.showEmoticons = function(){
      this.emoticons = [];
      emojione.ascii = true;
      for(i = 0; i < this.preEmoticons.length; i ++){
        let input = this.preEmoticons[i];
        let output = emojione.shortnameToImage(input);
        this.emoticons.push({
          sign: this.preEmoticons[i],
          code: output
        });
      }

    };

    this.selectEmoticon = function(emot, ind){
      let input = document.getElementById(ind + 'input-message').value;
      document.getElementById(ind + 'input-message').value = input + ' ' + emot.sign;
    }
  }
  closeChat(chat){
    let user1 = Meteor.user();

    if(chat.user1._id == user1._id){
      Talks.update({_id: chat._id},{
        $set:{
          'user1.open': false
        }
      })
    } else{
      Talks.update({_id: chat._id},{
        $set:{
          'user2.open': false
        }
      })
    }
  }
  sendMessage(chat, message, ind){
    let user1 = Meteor.user();

    // Emoji
    emojione.ascii = true;
    let input = document.getElementById(ind + 'input-message').value;
    let messageWithEmot = emojione.shortnameToImage(input);
    // emoji end
    if(!isPhoto && messageWithEmot){
      Talks.update({_id: chat._id},{
        $push: {
          messages: {
            sender: {
              _id: user1._id,
              username: user1.username,
            },
            date: new Date(),
            body: messageWithEmot
          }
        }
      })
      setTimeout(function(){
        let elem = document.getElementById(ind + 'chat-scroll');
        elem.scrollTop = elem.scrollHeight;
      }, 300);
    }
    // Photo Send
    let photoFile = '#' + ind + 'photoFile';
    var isPhoto = $(photoFile).get(0).files[0];
    if(isPhoto){
      let photo = ChatImages.insert({
          file: isPhoto,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, function(error){
          if(error){
          }
          else{
          }
      });
      setTimeout(function(){
        let photoId = photo.config.fileId;
        let concretePhoto = ChatImages.findOne({_id: photoId});
        let photoLink = concretePhoto.link();
        Talks.update({_id: chat._id},{
          $push: {
            messages: {
              sender: {
                _id: user1._id,
                username: user1.username,
              },
              date: new Date(),
              body: messageWithEmot,
              photo: photoLink
            }
          }
        });
        setTimeout(function(){
          let elem = document.getElementById(ind + 'chat-scroll');
          elem.scrollTop = elem.scrollHeight;
        }, 300);
      }, 3000);
    }
    // Photo send end

    // Unread in this conv
    if(messageWithEmot || isPhoto){
      let talk = Talks.findOne({_id: chat._id});
      if(chat.user1._id == user1._id){
        if(!chat.user2.open){
          let unreadInc = talk.user2.unread + 1;
          Talks.update({_id: chat._id},{
            $set:{
              'user2.unread': unreadInc,
              'user2.lastReceived': 'unread',
            }
          })
        }
      } else{
        if(!chat.user1.open){
          let unreadInc = talk.user1.unread + 1;
          Talks.update({_id: chat._id},{
            $set:{
              'user1.unread': unreadInc,
              'user1.lastReceived': 'unread',
            }
          })
        }
      }
    }
  }
}

const name = 'chatWindows';

// Create module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: ChatWindows
});
