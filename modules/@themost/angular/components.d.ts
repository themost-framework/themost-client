import { OnInit } from '@angular/core';
import { AngularDataContext } from './client';
export declare class DataComponent implements OnInit {
    protected context: AngularDataContext;
    filter: string;
    model: string;
    select: string;
    group: string;
    order: string;
    top: number;
    count: boolean;
    skip: number;
    expand: string;
    url: string;
    value: any;
    constructor(context: AngularDataContext);
    ngOnInit(): Promise<void>;
}
