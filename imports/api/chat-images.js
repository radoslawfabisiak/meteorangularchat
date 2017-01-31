import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ChatImages = new FilesCollection({
  storagePath: '/Applications/MAMP/htdocs/custom/meteor/chat/uploads',
  collectionName: 'ChatImages',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

if (Meteor.isServer) {
  /* Set deny/allow rules:
   * Deny all
   * @see http://docs.meteor.com/#/full/deny
   */
  ChatImages.denyClient();

  /* Allow all
   * @see http://docs.meteor.com/#/full/allow
   */
  ChatImages.allowClient();

  /* Deny per action
   * @see http://docs.meteor.com/#/full/deny
   */
  ChatImages.deny({
    insert: function() {
      return false;
    },
    update: function() {
      return true;
    },
    // remove: function() {
    //   return false;
    // }
  });

  /* Allow per action
   * @see http://docs.meteor.com/#/full/allow
   */
  ChatImages.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return false;
    },
    // remove: function() {
    //   return true;
    // }
  });
}
