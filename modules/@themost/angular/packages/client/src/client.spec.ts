import {TestBed, async, inject} from '@angular/core/testing';
import {MostModule, AngularDataContext} from './public_api';

describe('AngularDataContext', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                MostModule.forRoot({
                    base: 'http://localhost:3000/api/',
                    options: {
                        useMediaTypeExtensions: false
                    }
                })
            ]
        }).compileComponents();
    }));
    it('should get AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
        expect(context).toBeTruthy();
    }));
    it('should user AngularDataContext.getMetadata()', inject([AngularDataContext], async (context: AngularDataContext) => {
        // get metadata
        const metadata = await context.getMetadata();
        expect(metadata).toBeTruthy();
    }));
});
