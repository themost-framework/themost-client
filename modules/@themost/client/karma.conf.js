// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// tslint:disable trailing-comma
// tslint:disable object-literal-sort-keys
module.exports = function(config) {
  config.set({
    basePath: "./src/",
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "**/*.ts" }
    ],
    port: 8080,
    plugins: [
      require("karma-jasmine"),
      require("karma-typescript"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter")
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript" // *.tsx for React Jsx
    },
    karmaTypescriptConfig: {
      tsconfig: "../tsconfig.spec.json"
    },
    reporters: ["progress", "karma-typescript"],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ "Chrome" ],
    singleRun: true
  });
};
// tslint:enable trailing-comma
// tslint:enable object-literal-sort-keys
