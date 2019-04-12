module.exports = function (api) {
    api.cache(false);
    return {
    "sourceMaps": "both",
    "retainLines": true,
    "presets": [
        "@babel/preset-typescript",
        "@babel/preset-env"
    ],
    "ignore": [
      "./node_modules/"
    ],
    "plugins": [
            [
                "@babel/plugin-proposal-object-rest-spread"
            ],
            [
                "@babel/plugin-proposal-class-properties",
                {
                    "loose": true
                }
            ]
        ]
    };
};