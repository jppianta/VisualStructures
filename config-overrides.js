const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
        config,
    );

    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@primary-color": "#77BDC7",
            "@btn-primary-color": "#272A2A",
            "@menu-item-color": "#EEF7F8",
            "@font-family": "'Muli', sans-serif" 
        },
        javascriptEnabled: true,
    })(config, env);

    return config;
};