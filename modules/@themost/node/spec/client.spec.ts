import {NodeDataContext, NodeDataService} from '../src';
import {EdmSchema} from '@themost/client';
describe('NodeDataContext', () => {
    it('should create instance', () => {
       const context = new NodeDataContext('/', {
           useMediaTypeExtensions: false,
           useResponseConversion: true
       });
       expect(context).toBeTruthy();
    });
    it('should use NodeDataContext.getBase()', () => {
        const context = new NodeDataContext('/', {
            useMediaTypeExtensions: false,
            useResponseConversion: true
        });
        expect(context.getBase()).toBe('/');
    });
    it('should use NodeDataContext.getService()', () => {
        const context = new NodeDataContext('/', {
            useMediaTypeExtensions: false,
            useResponseConversion: true
        });
        expect(context.getService()).toBeInstanceOf(NodeDataService);
    });
    it('should use NodeDataContext.getMetadata()', async () => {
        const context = new NodeDataContext('http://localhost:3000/api/', {
            useMediaTypeExtensions: false,
            useResponseConversion: true
        });
        const schema = await context.getMetadata();
        expect(schema).toBeTruthy();
        expect(schema).toBeInstanceOf(EdmSchema);
    });
});
