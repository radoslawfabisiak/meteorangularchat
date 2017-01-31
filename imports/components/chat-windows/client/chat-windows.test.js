import { name as ChatWindows } from '../chat-windows';
import { Talks } from '../../../api/talks';
import 'angular-mocks';

describe('ChatWindows', () => {
  beforeEach(() => {
    window.module(ChatWindows);
  })

  describe('controller', () =>{
    let controller;
    let message = {
      body: 'hello',
      ind: 0
    }
    let openedChats = [];
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

    beforeEach(()=>{
      inject(($rootScope, $componentController)=>{
        controller = $componentController(ChatWindows, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    describe('opened chats', () => {
      beforeEach(()=>{
      });
      it('is opened chats array', () => {
        expect(openedChats).toEqual([]);
      })
    })
    
    // I will be soon...

  })

  // Controller End
});
