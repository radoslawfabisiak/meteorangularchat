import { Mongo } from 'meteor/mongo';

export const Talks = new Mongo.Collection('talks');

Talks.allow({
  insert: function(userId){
    return userId;
  },
  update: function(userId, talk){
    return userId && (talk.user1._id == userId || talk.user2._id == userId);
  }
})
