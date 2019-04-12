import {TestBed, async, inject} from '@angular/core/testing';
import {MostModule, AngularDataContext} from './public_api';
describe('MostModule', () => {
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        MostModule.forRoot({
                base: '/',
                options: {
                    useMediaTypeExtensions: true
                }
            })
      ]
    }).compileComponents();
  }));
  it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
    expect(context).toBeTruthy();
  }));
  it('should inject AngularDataContext', inject([AngularDataContext], (context: AngularDataContext) => {
    expect(context.getBase()).toBe('/');
  }));
});