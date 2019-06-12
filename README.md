# vue-cli-plugin-tailwind
[![Tailwind CSS](https://img.shields.io/npm/dependency-version/vue-cli-plugin-tailwind/tailwindcss.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/npm/l/vue-cli-plugin-tailwind.svg)](https://github.com/forsartis/vue-cli-plugin-tailwind/blob/master/LICENSE)

A plugin that adds Tailwind CSS and Purgecss to your vue-cli project.

## Getting started
Inside your vue-cli project folder add the plugin via:
```
vue add tailwind
```
Choose what Tailwind config you want to generate:
* **none** - Won't create a config file. Useful if you already have a config or you don't need to change Tailwinds default styles.
* **minimal** *(default)* - Will create a minimal `tailwind.config.js` file where you can define your customizations.
* **full** - Will generate a `tailwind.config.js` file containing the entire default configuration.

See [Tailwinds configuration guide](https://tailwindcss.com/docs/configuration) for more info.

## PostCSS Configuration
Tailwind CSS and Purgecss will be added as plugins in your PostCSS config.
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    'vue-cli-plugin-tailwind/purgecss': {},
    autoprefixer: {},
  },
};
```
### Custom Tailwind config file name
If you use a name other than `tailwind.config.js` for the Tailwind config file, you will need to specify it in your PostCSS configuration.
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: 'custom-name.js',
    //...
  },
};
```
### Configure Purgecss
By default Purgecss will look for css selectors in your `.html` files inside the `./public` directory and `.vue` files inside the `./src` directory.
```javascript
let config = {
  content: ['./public/**/*.html', './src/**/*.vue'],
  defaultExtractor: content =>
    content.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [],
};
```
You can extend/override the default config in your PostCSS configuration.
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    'vue-cli-plugin-tailwind/purgecss': {
      whitelist: ['foo', 'bar'],
    },
    autoprefixer: {},
  },
};
```
Check [https://www.purgecss.com/configuration#options](https://www.purgecss.com/configuration#options) for a list of available options.

## License
[MIT](https://github.com/forsartis/vue-cli-plugin-tailwind/blob/master/LICENSE)
