const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');


module.exports = function override(config, env) {
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], // change importing css to less
        config,
    );
    config = rewireLess.withLoaderOptions({
        modifyVars: { 
            "@primary-color": "#19d27d",                         // primary color for all components
            "@link-color": "#19d27d",                            // link color
            "@success-color": "#19d27d",                         // success state color
            "@warning-color": "#faad14",                         // warning state color
            "@error-color": "#f5222d",                           // error state color
            "@font-size-base": "14px",                           // major text font size
            "@heading-color": "rgba(0, 0, 0, .85)",              // heading text color
            "@text-color": "rgba(0, 0, 0, .65)",                 // major text color
            "@text-color-secondary ": "rgba(0, 0, 0, .45)",      // secondary text color
            "@disabled-color ": "rgba(0, 0, 0, .25)",            // disable state color
            "@border-radius-base": "2px",                        // major border radius
            "@border-color-base": "#d9d9d9",                     // major border color
            "@box-shadow-base": "0 2px 8px rgba(0, 0, 0, .15)",  // major shadow for layers
            "@icon-url": "~/iconfont/iconfont"
        },
        javascriptEnabled: true,
    })(config, env);
    return config;
};