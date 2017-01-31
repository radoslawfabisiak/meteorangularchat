import { name as ChatList } from '../chat-list';
import { Talks } from '../../../api/talks';
import 'angular-mocks';

describe('ChatList', () => {
  beforeEach(() => {
    window.module(ChatList);
  })
  describe('controller', () =>{
    let controller;

    beforeEach(()=>{
      inject(($rootScope, $componentController)=>{
        controller = $componentController(ChatList, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    describe('start chat', () => {

      describe('check is chat', () => {
        let user1 = { userId: 'idnumber1', username: 'user1'};
        let user2 = { userId: 'idnumber2', username: 'user2'};
        let users = [user1.userId, user2.userId];
        let talk;
        let findTalk = function(){
          let talkToReturn = Talks.findOne( function() {return ((user1.userId == user1.userId && user2.userId == user2.userId) || (user1.userId == user2.userId && user2.userId == user1.userId))});
          return talkToReturn;
        }
        let insertTalk = function(){
          let id = Talks.insert({
            users: users,
            user1: {
              _id: user1.userId,
              username: user1.username,
              open: true,
              unread: 0
            },
            user2: {
              _id: user2.userId,
              username: user2.username,
              unread: 0
            },
            messages: []
          });
          return id;
        }
        let insertedTalk;
        let updateTalk = function(id){
          Talks.update({_id: id},{
            $set:{
              'user1.open': true,
              'user1.unread': 0,
              'user1.lastReceived': ''
            }
          })
        }
        describe('is not chat', () =>{
          beforeEach(() => {
            spyOn(Talks, 'insert');
            talk = findTalk();
            insertTalk();
          });

          it('should be undefined', () => {
            expect(talk).toEqual(undefined);
          });

          it('should insert', () => {
            expect(Talks.insert).toHaveBeenCalled();
          });
        })

        describe('is chat', () =>{
          beforeEach(() => {
            insertedTalkId = insertTalk();
            talk = findTalk();
            spyOn(Talks, 'update');
            updateTalk(insertedTalkId);
          })

          it('should be chat id', () => {
            expect(talk._id).toEqual(insertedTalkId);
          })
          it('open chat window', () => {
            expect(Talks.update).toHaveBeenCalled();
          })
        })

      })
    });
  });
  // Controller End
});
