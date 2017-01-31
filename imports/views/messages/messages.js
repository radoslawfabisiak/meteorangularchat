import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './messages.html';

class Messages {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

  }
}

const name = 'messages';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  template,
  controllerAs: name,
  controller: Messages
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('logged.messages', {
      url: '/messages',
      template: '<messages></messages>'
    });
}
