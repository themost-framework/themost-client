window.assert = chai.assert;
window.expect = chai.expect;
describe('common module tests', function() {
    //set timeout
    this.timeout(45000);
    var $log, $context;
    beforeEach(function (done) {
        var self = this;
        $log = angular.element(document.body).injector().get('$log');
        $context = angular.element(document.body).injector().get('$context');
        $context.setBasicAuthorization("alexis.rees@example.com","user");
        return done();
    });

    it('should use basic authentication ', function(done) {
        $context.model('Product').where('category').equal('Laptops').getItems().then(function (result) {
            console.log(result);
            return done();
        }).catch(function (err) {
                return done(err);
        });
    });

});