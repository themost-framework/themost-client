/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {IDirective,IScope} from 'angular';
import angular = require("angular");
import servicesModule from './services';

const ngModule = angular.module('most', [servicesModule]);

function localized(text, localeSet) {
    window["locales"] = window["locales"] || {};
    localeSet = localeSet || 'global';
    if (typeof text !== 'string')
        return text;
    if (text.length === 0)
        return text;
    const locale = window["locales"][localeSet];
    if (locale) {
        const out = locale[text];
        if (out)
            return out;
    }
    return text;
}

function MostLocalizedDirective():IDirective {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (attrs.title)
                element.attr('title', localized(attrs.title, attrs['mostLoc']));
            if (attrs.placeholder)
                element.attr('placeholder', localized(attrs.placeholder, attrs['mostLoc']));
        }
    };
}



function MostLocalizedHtmlDirective():IDirective {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            const text = localized(element.html(), attrs['mostLocHtml']);
            if (text)
                element.html(text);
        }
    };
}

function MostLocalizedFilter() {
    return function(input, localeSet) {
        return localized(input, localeSet);
    };
}

interface MostEventDirectiveScope extends IScope {
    $args:any
}

function MostEventDirective($timeout):IDirective {
    return {
        restrict: 'E',
        link: function(scope:MostEventDirectiveScope, element, attrs) {
            //get event name
            const name = element.attr('name') || attrs['event'], action = attrs['eventAction'];
            if (name) {
                scope.$on(name, function(event, args) {
                    if (action) {
                        $timeout(function(){
                            scope.$args = args;
                            try {
                                scope.$apply(action);
                            }
                            catch(e) {
                                console.log(e);
                            }
                            scope.$args = null;
                        });
                    }
                });
            }
        }
    };
}

/**
 * @return {IDirective}
 * @constructor
 */
function MostWatchDirective():IDirective {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            //get event name
            const name = element.attr('name') || attrs['event'], args = attrs['eventArgs'];
            if (name) {
                if (typeof scope.$broadcast === 'function') {
                    scope.$watch(args, function (value) {
                        scope.$broadcast(name, value);
                    });
                }
                else {
                    scope.$watch(args, function (value) {
                        scope.$emit(name, value);
                    });
                }
            }
        }
    };
}


function MostItemDirective($window):IDirective {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope: MostDataItemScope, element, attrs) {
            scope.route = $window.route;
            const item = scope.$eval(attrs['mostItem']);
            item.then(function(result) {
                scope.item = result;
            }, function(reason) {
                console.log(reason);
                scope.item = null;
            });
        }
    };
}

function MostVariableDirective($timeout):IDirective {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            if (attrs.ngValue) {
                return scope.$eval(attrs.name + "=" + attrs.ngValue + ";");
            }
            function set_(value) {
                if (scope.$$phase === '$digest' || scope.$$phase === '$apply') {
                    $timeout(function() {
                        scope[attrs.name] = value;
                    });
                }
                else {
                    scope[attrs.name] = value;
                }
            }
            scope.$watch(attrs.value, function(newValue) {
                set_(newValue);
            });
        }
    };
}

function MostParamDirective($window):IDirective {
    return {
        restrict: 'AE',
        link: function(scope:MostDataRouteScope, element, attrs) {
            scope.route = $window.route;
            if (attrs['mostParam']) {
                const values = attrs['mostParam'].split(';');
                const params = { };
                for (let i = 0; i < values.length; i++) {
                    let value = values[i].split('=');
                    if (value.length===2)
                        params[value[0]] = value[1];
                }
                $window.route = $window.route || { };
                for (let name in params) {
                    if (params.hasOwnProperty(name)) {
                        scope.$watch(params[name], function(newValue) {
                            $window.route[name] = newValue;
                        });
                    }
                }
            }
            else {
                scope.$watch(attrs.value, function(newValue) {
                    $window.route = $window.route || { };
                    $window.route[attrs.name] = newValue;
                });
            }

        }
    };
}

interface MostDataRouteScope extends IScope {
    route:any;
}

interface MostDataItemScope extends IScope {
    route:any;
    item:any;
}

interface MostDataInstanceScope extends MostDataRouteScope {
    filter:string;
    model:string;
    select:string;
    group:string;
    order:string;
    top:number;
    count:boolean;
    skip:number;
    expand:string;
    prepared:boolean;
    url:string;
}

function MostDataInstanceDirective($context, $parse, $window):IDirective {
    return {
        restrict: 'E',
        scope: { model:'@', filter:'@',  select:'@', group:'@', order:'@', top:'=', count:'=', skip:'=', expand:'@', prepared:'=', url:'@' },
        link: function(scope:MostDataInstanceScope, element, attrs) {
            if (typeof scope.model === 'undefined')
                return;
            scope.route = $window.route;
            const q = $context.model(scope.model).asQueryable();
            let arr = [];
            if (typeof scope.url === 'string' && scope.url.length > 0) {
                q.setUrl(scope.url);
            }
            //apply select (if any)
            if (scope.select)
            {
                arr = scope.select.split(',');
                //apply as array expression if we have only one field
                if (arr.length==1)
                    q.asArray(true);
                q.select(arr);
            }
            if (scope.group) {
                if (angular.isArray(scope.group))
                    q.group(scope.group);
                else if (typeof scope.group === 'string' && scope.group.length > 0)
                    q.group(scope.group.split(','));
            }
            if (scope.order) {
                arr = [];
                if (typeof scope.order === 'string' && scope.order.length > 0)
                    arr = scope.order.split(',');
                for (let i = 0; i < arr.length; i++) {
                    let str = arr[i];
                    let matches = /(.*?) desc$/i.exec(str);
                    if (matches) {
                        q.orderByDescending(matches[1]);
                    }
                    else {
                        matches = /(.*?) asc$/i.exec(str);
                        if (matches) {
                            q.orderBy(matches[1]);
                        }
                        else {
                            q.orderBy(str);
                        }
                    }
                }
            }
            if (scope.skip>0) {
                q.skip(scope.skip);
            }
            if (scope.top>0) {
                q.take(scope.top);
            }
            if (scope.count) {
                q.paged(true);
            }
            if (typeof scope.filter === 'string' && scope.filter.length > 0) {
                q.filter(scope.filter);
                if (scope.prepared) {
                    q.prepare();
                }
            }

            if (typeof scope.expand === 'string' && scope.expand.length > 0) {
                q.expand(scope.expand.split(','));
            }
            //set queryable
            q.getItems().then(function(result) {
                const getter = $parse(attrs.name);
                let setter;
                if (getter)
                    setter = getter.assign;
                if (typeof setter === 'function') {
                    setter(scope.$parent, (q.$top === 1) ? result[0] : result);
                }
            });

            //register for order change
            scope.$on('order.change', (event, args) => {
                if (typeof args === 'string')
                {
                    if (args.length===0) {
                        delete q.$orderby;
                        q.reset().getItems().then(result => {
                            scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                        });
                    }
                    else {
                        const orders = args.split(',');
                        if (orders.length===1) {
                            if (typeof q.$orderby !== 'undefined') {
                                const previousOrders= q.$orderby.split(',');
                                if (previousOrders.length===1) {
                                    const arr1 = orders[0].split(' '), arr2 = previousOrders[0].split(' ');
                                    if (typeof arr1[1] === 'undefined') {
                                        if (arr1[0]===arr2[0]) {
                                            if ((typeof arr2[1] === 'undefined') || (arr2[1] === 'asc')) {
                                                arr1.push('desc');
                                                orders[0] = arr1.join(' ');
                                            }
                                            else{
                                                arr1.push('asc');
                                                orders[0] = arr1.join(' ');
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        q.reset().orderBy(orders.join(',')).getItems().then((result) => {
                            scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                        });
                    }
                }
            });

            //register for filter change
            scope.$on('filter.change', function(event, args)
            {
                if (typeof args === 'object') {
                    if (args.name===attrs.name) {
                        if (typeof args.filter === 'string') {
                            q.reset().filter(args.filter).getItems().then((result) => {
                                scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                            });
                        }
                    }
                }
                else if (typeof args === 'string') {
                    q.reset().filter(args).getItems().then(result => {
                        scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                    });
                }
            });

            //register for filter change
            scope.$on('page.change', function(event, args)
            {
                if (typeof args === 'object') {
                    if (args.name===attrs.name) {
                        if (typeof args.page !== 'undefined') {
                            const page = parseInt(args.page), size = scope.top;
                            if (size<=0) { return; }
                            q.reset().skip((page-1)*size).getItems().then((result) => {
                                scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                            });
                        }
                    }
                }
            });

            const dataReload = function(event, args)
            {
                if (typeof args === 'object') {
                    if (args.name===attrs.name) {
                        q.reset().getItems().then(result => {
                            scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                        });
                    }
                }
                else if (typeof args === 'string') {
                    if (args===attrs.name) {
                        q.reset().getItems().then(result => {
                            scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                        });
                    }
                }

            };
            const dataRefresh = function(event, args)
            {
                if (typeof args === 'object') {
                    if (args.model=== q.$model) {
                        q.reset().getItems().then(result => {
                            scope.$parent[attrs.name] = (q.$top === 1) ? result[0] : result;
                        });
                    }
                }

            };
            //register for data reload
            scope.$on('data.reload', dataReload);
            //register for data refresh
            scope.$on('item.new', dataRefresh);
            //register for data refresh
            scope.$on('item.save', dataRefresh);
            //register for data refresh
            scope.$on('item.delete', dataRefresh);

        }
    };
}

ngModule.directive('loc',MostLocalizedDirective)
    .directive('locHtml',MostLocalizedHtmlDirective)
    .filter('loc',[MostLocalizedFilter])
    .directive('mostEvent',MostEventDirective)
    .directive('mostWatch',MostWatchDirective)
    .directive('mostItem',MostItemDirective)
    .directive('mostData',MostDataInstanceDirective)
    .directive('mostVariable',MostVariableDirective)
    .directive('mostParam',MostParamDirective);

export default ngModule.name;