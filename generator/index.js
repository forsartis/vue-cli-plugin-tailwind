const fs = require('fs');
const path = require('path');

const filenameTailwind = 'tailwind.config.js';

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
  if (!fs.existsSync(tailwind)) throw new Error(`${tailwind} not found`);
  spawnSync(tailwind, args, { shell: process.platform === 'win32' });
}

function injectPurgeConfig(ctx) {
  const configPath = path.join(ctx, filenameTailwind);
  const tailwindConfig = fs.readFileSync(configPath, 'utf-8');
  fs.writeFileSync(
    configPath,
    tailwindConfig.replace(
      'purge: []',
      "purge: { content: ['./public/**/*.html', './src/**/*.vue'] }",
    ),
  );
}

module.exports = (api, options) => {
  const postcss = readPostcssConfig(api.generator);
  const configs = {
    dependencies: {
      '@tailwindcss/postcss7-compat': '^2.0.2',
      autoprefixer: '^9',
      postcss: '^7',
      tailwindcss: 'npm:@tailwindcss/postcss7-compat@^2.0.2',
    },
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  };

  configs.postcss.plugins = { ...configs.postcss.plugins, ...postcss.plugins };

  api.extendPackage(configs);

  api.injectImports(api.entryFile, `import './assets/tailwind.css'`);
  api.render('./template');

  if (options.replaceConfig) {
    delete api.generator.files[filenameTailwind];
    const configPath = path.join(api.generator.context, filenameTailwind);
    try {
      fs.unlinkSync(configPath);
    } catch (error) {
      throw new Error(error);
    }
  }

  if (options.initConfig && options.replaceConfig !== false) {
    api.onCreateComplete(() => {
      generateConfig(options.initConfig);
      injectPurgeConfig(api.generator.context);
    });
  }
};
