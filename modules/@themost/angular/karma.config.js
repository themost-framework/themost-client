module.exports = function (config) {
    config.set({
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        files: [
            { pattern: 'test/src/test.ts', watched: false }
        ],
        preprocessors: {
            'test/src/test.ts': ['@angular/cli']
        },
        exclude: [
        ],
        angularCli: {
            environment: 'dev',
            preserveSymlinks: true
        },
        coverageIstanbulReporter: {
            reports: [ 'html', 'lcovonly' ],
            fixWebpackSourcePaths: true
        },
        reporters: config.angularCli && config.angularCli.codeCoverage
            ? ['progress', 'coverage-istanbul']
            : ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
};