// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'api'],
    plugins: [
      require('./karma-test-api-server'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter'),
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['kjhtml', 'mocha'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },
    reporters: ['kjhtml', 'mocha'],
    port: 8080,
    proxies: {
    },
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ "ChromeHeadlessNoSandbox" ],
    singleRun: false
  });
};
