import {TestBed, async, inject} from '@angular/core/testing';
import {MostModule, AngularDataContext} from './public_api';
import {HttpClient, HttpClientModule, HttpResponse} from '@angular/common/http';
import 'rxjs/operators';
describe('AngularDataContext', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MostModule.forRoot({
                    base: 'http://localhost:8081/api/',
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
    it('should user AngularDataContext.getMetadata()', inject([AngularDataContext, HttpClient],
        async (context: AngularDataContext, http: HttpClient) => {
        http.post('http://localhost:8081/auth/token', {
            client_id: '9165351833584149',
            client_secret: 'hTgqFBUhCfHs/quf/wnoB+UpDSfUusKA',
            username: 'alexis.rees@example.com',
            password: 'secret',
            grant_type: 'password',
            scope: 'profile'
        }, {
            responseType: 'json'
        }).subscribe( (res: HttpResponse<any>) => {
            const token = res.body;
            // get metadata
            context.setBearerAuthorization(token.access_token);
            const metadata = context.getMetadata();
            expect(metadata).toBeTruthy();
        }, (err) => {
            console.log(err);
        });
    }));
});
