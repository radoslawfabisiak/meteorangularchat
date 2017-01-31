import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

// Template
import template from './mainEngine.html';

// Components
import { name as Navigation } from '../components/navigation/navigation';
import { name as Login } from '../components/login/login';
import { name as Register } from '../components/register/register';
import { name as ChatList } from '../components/chat-list/chat-list';
import { name as ChatWindows } from '../components/chat-windows/chat-windows';
import { name as MessagesList } from '../components/messages-list/messages-list';

// Views
import { name as Home } from '../views/home/home';
import { name as LoggedOut } from '../views/logged-out/logged-out';
import { name as Logged } from '../views/logged/logged';
import { name as Messages } from '../views/messages/messages';
import { name as Talk } from '../views/talk/talk';


class MainEngine {}

const name = 'mainEngine';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  // Components
  Login,
  Register,
  Navigation,
  ChatList,
  ChatWindows,
  MessagesList,
  // Views
  LoggedOut,
  Logged,
  Home,
  Messages,
  Talk,
]).component(name, {
  template,
  controllerAs: name,
  controller: MainEngine
})
  .config(config);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');
}
