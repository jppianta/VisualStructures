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
            "@menu-bg": "#EEF7F8",
            "@menu-dark-item-active-bg": "#77BDC7",
            "@menu-dark-bg": "#1f2125",
            "@menu-dark-submenu-bg": "#3d6e7a",
            "@menu-item-color": "#272A2A",
            "@font-family": "'Muli', sans-serif" 
        },
        javascriptEnabled: true,
    })(config, env);

    return config;
};