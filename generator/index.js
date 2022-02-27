const fs = require('fs');

const filenameTailwind = 'tailwind.config.js';

function loadModule(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

function readPostcssConfig(api) {
  const filename = 'postcss.config.js';
  const file = api.generator.files[filename];

  if (file) {
    const filePath = api.resolve(filename);
    fs.writeFileSync(filePath, '');
    return loadModule(file, filename);
  }

  const config = api.generator.originalPkg.postcss;
  if (config) {
    const copy = { ...config };
    delete config.plugins;
    return copy;
  }

  return {};
}

function generateConfig(api, option) {
  const args = ['init'];
  if (option === 'full') {
    args.push('--full');
  }
  const { spawnSync } = require('child_process');
  const tailwind = api.resolve('./node_modules/.bin/tailwind');
  if (!fs.existsSync(tailwind)) throw new Error(`${tailwind} not found`);
  spawnSync(tailwind, args, {
    cwd: api.generator.context,
    shell: process.platform === 'win32',
  });
}

function injectContentConfig(api) {
  const configPath = api.resolve(filenameTailwind);
  const tailwindConfig = fs.readFileSync(configPath, 'utf-8');
  fs.writeFileSync(
    configPath,
    tailwindConfig.replace(
      'content: []',
      "content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}']",
    ),
  );
}

module.exports = (api, options) => {
  const postcss = readPostcssConfig(api);
  const configs = {
    dependencies: {
      autoprefixer: '^10',
      postcss: '^8',
      tailwindcss: '^3',
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
    const configPath = api.resolve(filenameTailwind);
    try {
      fs.unlinkSync(configPath);
    } catch (error) {
      throw new Error(error);
    }
  }

  if (options.initConfig && options.replaceConfig !== false) {
    api.onCreateComplete(() => {
      generateConfig(api, options.initConfig);
      injectContentConfig(api);
    });
  }
};
