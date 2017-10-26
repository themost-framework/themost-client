/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {IServiceProvider} from 'angular';
import angular = require("angular");
import {AngularDataContext} from "./client";

const ngModule = angular.module('most.services', []);

class ContextProvider implements IServiceProvider {

    public defaults: any;

    constructor() {
        this.defaults = { base:"/" };
    }
    $get($http, $q): any {
        return new AngularDataContext(this.defaults.base, $http, $q);
    };
}
ngModule.provider("$context",ContextProvider);

export default 'most.services';

