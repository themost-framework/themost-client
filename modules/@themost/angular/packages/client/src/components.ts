/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {Component, Input, OnInit, Output} from '@angular/core';
import {AngularDataContext} from './client';

@Component({
    selector: 'most-data',
    template: '<div></div>'
})

export class DataComponent implements OnInit {

    @Input() filter: string;
    @Input() model: string;
    @Input() select: string;
    @Input() group: string;
    @Input() order: string;
    @Input() top: number;
    @Input() count: boolean;
    @Input() skip: number;
    @Input() expand: string;
    @Input() url: string;
    @Output() value: any;

    constructor(protected context: AngularDataContext) {
        //
    }

    ngOnInit() {
        if (typeof this.model === 'undefined' || this.model === null) {
            return;
        }
        const q = this.context.model(this.model).asQueryable();
        if (typeof this.url === 'string' && this.url.length > 0) {
            q.setUrl(this.url);
        }
        if (typeof this.filter === 'string' && this.filter.length > 0) {
            q.setParam('$filter', this.filter);
        }
        if (typeof this.select === 'string' && this.select.length > 0) {
            q.setParam('$select', this.select);
        }
        if (typeof this.group === 'string' && this.group.length > 0) {
            q.setParam('$group', this.group);
        }
        if (typeof this.order === 'string' && this.order.length > 0) {
            q.setParam('$order', this.order);
        }
        if (typeof this.expand === 'string' && this.expand.length > 0) {
            q.setParam('$expand', this.expand);
        }
        if (this.skip > 0) {
            q.setParam('$skip', this.skip);
        }
        if (this.top > 0) {
            q.setParam('$top', this.top);
        }
        if (this.count) {
            q.setParam('$count', true);
        }

        if (this.count) {
            return q.getList().then((result) => {
                this.value = result;
            }).catch((err) => {
                //
            });
        }
        // set queryable
        q.getItems().then((result) => {
            if (this.top === 1) {
                if (result && result.value instanceof Array) {
                    this.value = result.value[0];
                } else {
                    this.value = result[0];
                }
            } else {
                this.value = result;
            }
        }).catch((err) => {
            //
        });

    }

}
