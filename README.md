# vue-cli-plugin-tailwind
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-^2.0.2-blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/npm/l/vue-cli-plugin-tailwind.svg)](https://github.com/forsartis/vue-cli-plugin-tailwind/blob/master/LICENSE)

A plugin that adds Tailwind CSS to your vue-cli project.

## Getting started
Inside your vue-cli project folder add the plugin via:
```
vue add tailwind
```
Choose what Tailwind config you want to generate:
* **none** - Won't create a config file. Useful if you already have a config (make sure to configure PurgeCSS).
* **minimal** *(default)* - Will create a minimal `tailwind.config.js` file where you can define your customizations.
* **full** - Will generate a `tailwind.config.js` file containing the entire default configuration.

See [Tailwinds configuration guide](https://tailwindcss.com/docs/configuration) for more info.

## PostCSS Configuration
Tailwind CSS will be added as plugins in your PostCSS config.
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```
## License
[MIT](https://github.com/forsartis/vue-cli-plugin-tailwind/blob/master/LICENSE)
