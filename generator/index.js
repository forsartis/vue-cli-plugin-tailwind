module.exports = (api, options) => {
  const configs = {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
        'vue-cli-plugin-tailwind/purgecss': {},
      },
    },
  };
  api.addConfigTransform('postcss', {
    file: {
      js: ['postcss.config.js'],
      json: ['.postcssrc.json', '.postcssrc'],
      yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
    },
  });
  api.extendPackage(configs);

  api.injectImports(api.entryFile, `import './assets/tailwind.css'`);
  api.render('./template');

  api.onCreateComplete(() => {
    const { spawnSync } = require('child_process');
    spawnSync('./node_modules/.bin/tailwind', ['init', 'tailwind.config.js']);
  });
};
