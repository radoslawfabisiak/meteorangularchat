import { Meteor } from 'meteor/meteor';

import { Talks } from '../imports/api/talks';
import { ChatImages } from '../imports/api/chat-images';

if (Meteor.isServer) {
  Meteor.publish('talks', function(){
    const selector = {
      users:{
        "$in": [this.userId]
      }
    }
    return Talks.find(selector);
  });
  Meteor.publish('users', function(){
    return Meteor.users.find({});
  });
  // Cursor for one doc
  Meteor.publish('images', function(){
    return ChatImages.find({}).cursor;
  });
}
