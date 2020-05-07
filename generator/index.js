const fs = require('fs');
const path = require('path');

function loadModule(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

function readPostcssConfig(generator) {
  const filename = 'postcss.config.js';
  const file = generator.files[filename];

  if (file) {
    const filePath = path.join(generator.context, filename);
    fs.writeFileSync(filePath, '');
    return loadModule(file, filename);
  }

  const config = generator.originalPkg.postcss;
  if (config) {
    const copy = { ...config };
    delete config.plugins;
    return copy;
  }

  return {};
}

function generateConfig(option) {
  const args = ['init'];
  if (option === 'full') {
    args.push('--full');
  }
  const { spawnSync } = require('child_process');
  const tailwind = path.resolve('./node_modules/.bin/tailwind');
  spawnSync(tailwind, args, { shell: process.platform === 'win32'});
}

module.exports = (api, options) => {
  const postcss = readPostcssConfig(api.generator);
  const configs = {
    postcss: {
      plugins: {
        tailwindcss: {},
        'vue-cli-plugin-tailwind/purgecss': {},
        autoprefixer: {},
      },
    },
  };

  configs.postcss.plugins = { ...configs.postcss.plugins, ...postcss.plugins };

  api.extendPackage(configs);

  api.injectImports(api.entryFile, `import './assets/tailwind.css'`);
  api.render('./template');

  if (options.replaceConfig) {
    const filename = 'tailwind.config.js';
    delete api.generator.files[filename];
    const configPath = path.join(api.generator.context, filename);
    try {
      fs.unlinkSync(configPath);
    } catch (error) {
      throw new Error(error);
    }
  }

  if (options.initConfig && options.replaceConfig !== false) {
    api.onCreateComplete(() => {
      generateConfig(options.initConfig);
    });
  }
};
