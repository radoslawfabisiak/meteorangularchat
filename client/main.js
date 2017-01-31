import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'bootstrap/dist/css/bootstrap.css';

import { name as MainEngine } from '../imports/mainEngine/mainEngine';

angular.module('creator', [
  angularMeteor,
  MainEngine
])
