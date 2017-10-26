var app = angular.module("app",["most"]);
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}
]);

app.config(['$contextProvider', function($contextProvider) {
    $contextProvider.defaults.base = "http://localhost:3000/";
}]);

app.controller('TestController', function($context) {
    $context.setBasicAuthorization("alexis.rees@example.com","user");
});