/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {EventEmitter} from 'events';
import {applyEachSeries} from 'async';
const listenersProperty = "listeners";
export class SequentialEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
    emit(event, args, callback)
    {
        //ensure callback
        callback = callback || function() {};
        //get listeners
        if (typeof this[listenersProperty] !== 'function') {
            throw new Error('undefined listeners');
        }
        const listeners = this[listenersProperty](event);
        //validate listeners
        if (listeners.length===0) {
            //exit emitter
            return callback();
        }
        //apply each series
        return applyEachSeries(listeners,[].concat(args, function(err) {
            return callback(err);
        }));
    }
}